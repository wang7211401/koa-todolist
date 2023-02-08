const KoaRouter = require('koa-router');
const {Sequelize} = require('sequelize')
const md5 = require('md5');
const moment = require('moment');
const Models = require('../models');

const router = new KoaRouter();

/** 
 * 存储所有的任务数据
 * 当前这个数据是存储在服务器的内存中
 */

let datas = {
    // appName: 'TodoList',
    // username: '',
    // skin: 'index.css',
    // tasks: [
    //     // { id: 1, title: '测试任务一', done: true },
    //     // { id: 2, title: '测试任务二', done: false },
    //     // { id: 3, title: '测试任务三', done: false },
    //     // { id: 4, title: '测试任务四', done: false },
    //     // { id: 5, title: '测试任务五', done: false },
    // ]
};

router.post('/login', async ctx => {
    let username = ctx.request.body.username.trim();
    let password = ctx.request.body.password;

    if (username == "" || password == "") {
        return ctx.body = {
            code: 1,
            msg: '用户名或密码不能为空！',
            data: ''
        }
    }

    let user = await Models.User.findOne({
        where: {
            username
        }
    })

    if (user == null) {
        return ctx.body = {
            code: 1,
            msg: '用户名不存在',
            data: ''
        }
    }

    if (user.get('password') !== md5(password)) {
        return ctx.body = {
            code: 1,
            msg: '用户名不存在或密码错误',
            data: ''
        }
    }

    ctx.session.uid = user.get('id');
    ctx.session.username = user.get('username')

    ctx.body = {
        code: 0,
        msg: '登录成功',
        data: {
            id: user.get('id'),
            username: user.get('username')
        }
    }
})

/* 首页,用于展示任务清单 */

router.get('/', async ctx => {
    // ctx.body = '/'
    let uid = ctx.session.uid
    if (!uid) {
        datas = {
            appName: 'TodoList',
            username: '',
            skin: 'index.css',
            tasks: [
                // { id: 1, title: '测试任务一', done: true },
                // { id: 2, title: '测试任务二', done: false },
                // { id: 3, title: '测试任务三', done: false },
                // { id: 4, title: '测试任务四', done: false },
                // { id: 5, title: '测试任务五', done: false },
            ]
        }
        return ctx.body = await ctx.render('index.html', {
            datas
        })
    }

    let content = await Models.Content.findAndCountAll({
        where: {
            user_id: uid
        },
        include: {
            model: Models.User
        }
    })

    datas = {
        appName: 'TodoList',
        id: uid,
        username: ctx.session.username,
        count: content.count,
        tasks: content.rows
    };

    ctx.body = await ctx.render('index.html', {
        datas
    });
})


router.post('/logout', async ctx => {
    ctx.session = null
    ctx.body = {
        code: 0,
        msg: '已退出登录',
        data: ''
    }
});

router.post('/register', async ctx => {
    let username = ctx.request.body.username;
    let email = ctx.request.body.email;
    let password = ctx.request.body.password;
    let repassword = ctx.request.body.repassword;

    if (username == "") {
        return ctx.body = {
            code: 1,
            msg: '用户名不能为空'
        }
    }

    if (email == "") {
        return ctx.body = {
            code: 1,
            msg: '邮箱不能为空'
        }
    }

    if (password == "" || repassword == "") {
        return ctx.body = {
            code: 1,
            msg: '密码不能为空'
        }
    }

    if (password !== repassword) {
        return ctx.body = {
            code: 1,
            msg: '两次输入的密码不一致',
            data: ''
        }
    }

    let user = await Models.User.findOne({
        where: {
            username
        }
    })

    if (user) {
        return ctx.body = {
            code: 1,
            msg: '当前用户名已经被注册了',
            data: ''
        }
    }

    let newUser = await Models.User.build({
        username,
        email,
        password: md5(password)
    }).save()

    ctx.body = {
        code: 0,
        msg: '注册成功',
        data: {
            id: newUser.get('id'),
            username: newUser.get('username')
        }
    }
})

/** 
 * 添加，添加新的任务
 */

router.post('/add', async ctx => {
    let uid = ctx.session.uid
    let title = ctx.request.body.title;


    if (!uid) {
        return ctx.body = {
            code: 1,
            msg: '请先登录后操作！',
            data: ''
        }
    }

    let user = await Models.User.findOne({
        where:{
            id: uid
        }
    })

    console.log("user",user)

    if(!user){
        ctx.session.uid = null
        return ctx.body = {
            code: 1,
            msg: '请重新登录后操作！',
            data: ''
        }
    }

    let newContent = await Models.Content.build({
        user_id: uid,
        title
    }).save();

    ctx.body = {
        code: 0,
        msg: '添加成功',
        data: newContent
    }

});

/** 
 * 改变，修改任务的状态
 */

router.post('/change', async ctx => {
    // datas.tasks.forEach(task => {
    //     if (task.id == ctx.params.id) {
    //         task.done = !task.done
    //     }
    // })

    let uid = ctx.session.uid
    let contentId = ctx.request.body.id;
    let done = ctx.request.body.done;

    if (!uid) {
        return ctx.body = {
            code: 1,
            msg: '请先登录后操作！',
            data: ''
        }
    }

    let content = await Models.Content.findOne({
        where: {
            [Sequelize.Op.and]: [
                { 'id': contentId },
                { 'user_id': uid }
            ]
        }
    });

    if (!content) {
        return ctx.body = {
            code: 2,
            msg: '找不到对应的数据',
            data: ''
        }
    }

    content.set('done', done);

    await content.save();

    ctx.body = {
        code: 0,
        msg: '修改成功',
        data: ''
    }
})

/** 
 * 删除任务
 */

router.post('/remove', async ctx => {
    let uid = ctx.session.uid
    let contentId = ctx.request.body.id;

    if (!uid) {
        return ctx.body = {
            code: 1,
            msg: '请先登录后操作！',
            data: ''
        }
    }

    let content = await Models.Content.findOne({
        where: {
            [Sequelize.Op.and]: [
                { 'id': contentId },
                { 'user_id': uid }
            ]
        }
    });

    if (!content) {
        return ctx.body = {
            code: 2,
            msg: '找不到对应的数据',
            data: ''
        }
    }

    await Models.Content.destroy({
        where: {
            [Sequelize.Op.and]: [
                { 'id': contentId },
                { 'user_id': uid }
            ]
        }
    });

    ctx.body = {
        code: 0,
        msg: '删除成功',
        data: ''
    }

    // datas.tasks = datas.tasks.filter(task => task.id != ctx.params.id)
    // ctx.body = await ctx.render('index.html', {
    //         datas
    //     })
    // ctx.body = '/remove/' + ctx.params.id
})

module.exports = router;
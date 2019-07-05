const Koa = require('koa');
var bodyParser = require('koa-bodyparser');
const staticCache = require('koa-static-cache');
const Router = require('koa-router');
const Swig = require('koa-swig');
const co = require('co');

const app = new Koa()

app.use(bodyParser());
/** 
 * 处理静态文件
 */

app.use(staticCache('./static', {
    prefix: '/static',
    gzip: true
}))

const router = new Router();

/** 
 * 存储所有的任务数据
 * 当前这个数据是存储在服务器的内存中
 */

let datas = {
    _id: 5,
    appName: 'TodoList',
    skin: 'index.css',
    tasks: [
        { id: 1, title: '测试任务一', done: true },
        { id: 2, title: '测试任务二', done: false },
        { id: 3, title: '测试任务三', done: false },
        { id: 4, title: '测试任务四', done: false },
        { id: 5, title: '测试任务五', done: false },
    ]
};

/** 
 * 设置模板引擎
 */

app.context.render = co.wrap(Swig({
    root: __dirname + '/views',
    autoescape: true,
    cache: false,
    ext: 'html'
}))

/* 首页,用于展示任务清单 */

router.get('/', async ctx => {
    // ctx.body = '/'

    ctx.body = await ctx.render('index.html', {
        datas
    })
})

/** 
 * 添加，添加新的任务
 */

router.get('/add', ctx => {
    ctx.body = '/add'
});

router.post('/add', async ctx => {

    datas.tasks.push({
        id: ++datas._id,
        title: ctx.request.body.title,
        done: false
    })
    ctx.body = await ctx.render('index.html', {
        datas
    })
});

/** 
 * 改变，修改任务的状态
 */

router.post('/change/:id', async ctx => {
    datas.tasks.forEach(task => {
        if (task.id == ctx.params.id) {
            task.done = !task.done
        }
    })
    ctx.body = await ctx.render('index.html', {
            datas
        })
        // ctx.body = '/change/' + ctx.params.id
})

/** 
 * 删除任务
 */

router.post('/remove/:id', async ctx => {
    datas.tasks = datas.tasks.filter(task => task.id != ctx.params.id)
    ctx.body = await ctx.render('index.html', {
            datas
        })
        // ctx.body = '/remove/' + ctx.params.id
})

app.use(router.routes())

app.listen(3000)
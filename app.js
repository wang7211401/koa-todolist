const Koa = require('koa');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const staticCache = require('koa-static-cache');
const Swig = require('koa-swig');
const co = require('co');
const router = require('./routers/main');

const app = new Koa()

app.keys = ['some todo secret keys'];

const CONFIG = {
    key: 'todo_int',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};

app.use(session(CONFIG, app));

app.use(bodyParser());
/** 
 * 处理静态文件
 */

app.use(staticCache('./static', {
    gzip: true
}));

/** 
 * 设置模板引擎
 */

app.context.render = co.wrap(Swig({
    root: __dirname + '/views',
    autoescape: true,
    cache: false,
    ext: 'html'
}))


app.use(router.routes())

app.listen(3000)
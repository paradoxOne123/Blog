const Koa = require('koa')
const Session = require('koa-session') 
const bodyParser = require('koa-bodyparser')
const koaStatic  = require('koa-static')
const koaBody = require('koa-body');
// const routes = require('./routes/index');
const routeController = require('./routes/index')
const app = new Koa();
app.keys = ["some secret hurr"];

const memory = require('./lib/memory');
const cpu = require('./lib/cpu');

//1.这里搞个定时，获取日志，推送给页面 
//2.定时，计算是否危险，短信or邮件推送
//3.其他方式？比如如何监控长时间高负荷
console.log(memory.memory())
// console.log('sys: '+memory.sys)
// console.log('heap: '+memory.heap)

app.use(koaBody({
	multipart: true,
	formidable: {
			maxFileSize: 200*1024*1024    // 设置上传文件大小最大限制，默认2M 使用koa-body中间件后，即可通过ctx.request.files获取上传的文件
	}
}));

app.use(Session(app));
app.use(async (ctx, next)=> {
	console.log(ctx.request.path)
	const origin = ctx.request.header.origin
	ctx.set('Access-Control-Allow-Origin', origin);
	ctx.set('Access-Control-Allow-Credentials', 'true');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
    ctx.set('Access-Control-Allow-Methods', 'PATCH, PUT, POST, GET, DELETE, OPTIONS');
    if (ctx.method == 'OPTIONS') {
        ctx.body = 200;
    } else {
        await next();
    }
});
app.use(bodyParser());
// routes(app);
app.use(routeController())

module.exports = app;


// /app/schedule/monitor.js



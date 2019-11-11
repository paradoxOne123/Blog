const Koa = require('koa')
const Session = require('koa-session') 
const bodyParser = require('koa-bodyparser')
const koaStatic  = require('koa-static')
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


// module.exports = app => {
//   return {
//     schedule: {
// 	    interval: 10000,
//       type: 'worker',
// 	  },
//     async task(ctx) {
//       ctx.app.getLogger('monitorLogger').info('你想打印的日志结果')
//     }
//   }
// }

// // /config/config.prod.js
// const path = require('path');
// // 自定义日志，将日志文件自定义到一个单独的监控日志文件中
// module.exports = appInfo => {
//   return {
//     customLogger: {
//        monitorLogger: { file: path.resolve(__dirname, '../logs/monitor.log') }
//     }
//   }
// }




// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const logger = require('morgan');
// // const multer  = require('multer');

// const bodyParser = require('body-parser');

// //const indexRouter = require('./routes/index');
// //const usersRouter = require('./routes/users');
// const routes = require('./routes/index');
// const settings = require('./settings');
// //引入 flash 模块来实现页面通知,flash 是一个在 session 中用于存储信息的特定区域
// const flash = require('connect-flash');

// const app = express();

// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(flash());

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(bodyParser.json({limit: '50mb'}));
// app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

// //利用两个express的中间件实现在mongoDB数据库存储会话信息，后面可以通过 req.session 获取当前用户的会话对象x
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// app.use(session({
//   secret: settings.cookieSecret, //一个String类型的字符串，用来防止篡改cookie,作为服务器端生成session的签名。与cookieParser中的一致
//   saveUninitialized:false, //在存储一些新数据之前，不创建session
//   resave: false, //如果没有发生任何修改不储存session。
//     store:new MongoStore({
//     url:settings.url,//这里配置了数据库URL
//     //ttl: 3*24*60*60,
//     touchAfter:24*3600 //单位是秒，24小时内，无论你发多少个请求，session之后被更新一次
//     })
// }));

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
// 	console.log('middleware')
// 	console.log(req.cookies)
// 	// if(req.session.user){
// 	// 	console.log(req.session.user)
// 	// }
// 	next()
// 	// if(err){
// 	// 	
	
// 	// }
//   // next(createError(404));
// });

// // app.use(multer({
// //     dest: './public/images',//上传的文件所在的目录，
// //     rename: function (fieldname, filename) {//rename 函数用来修改上传后的文件名，这里设置为保持原来的文件名。
// //       return filename;
// //     }
// // }));

// routes(app);

// module.exports = app;

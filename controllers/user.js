let crypto = require('crypto'),
		User = require('../models/user.js');

async function getUserInfo(ctx) {
	ctx.status = 200
	if (ctx.session.user){
		ctx.body = {
			code: 1000,
			user: ctx.session.user
		};
  }else{
    ctx.body = {
			code: 1000,
			user: null
		};
	}
}

async function login(ctx) {
	try {
		const req = ctx.request.body;
		let md5 = crypto.createHash('md5'),
        password = md5.update(req.password).digest('hex');
		
		let newUser = new User({});
		const result = await newUser.get(req.name)
		console.log("login result list: ",result.list)

		if(result.err) {
			return ctx.body = {
				code: 5000,
				msg: result.err
			};
		}
		if(!result.list[0]) {
			return ctx.body = {
				code: 5000,
				msg: '用户不存在!'
			};
		}
		console.log(result.list[0].password, password)
		if (result.list[0].password != password) {
			return ctx.body = {
				code: 5000,
				msg: '密码错误!'
			};
		}
		console.log(result)
		ctx.session.user = result.list[0]
		console.log(ctx.session)
		ctx.status = 200
		ctx.body = {
			code: 1000,
			user: result.list[0]
		};
	} catch (e) {
		console.log(e)
	}
}

async function register(ctx) {
	try {
		const req = ctx.request.body;

		const name = req.name,
        email = req.email,
        password_f = req.password,
        password_re = req['password-repeat'];
    if (password_re != password_f) {
      res.send({code: 5000,msg: '两次输入的密码不一致!'});
    }
    let md5 = crypto.createHash('md5'),
        password = md5.update(req.password).digest('hex');
    let newUser = new User({
        name: name,
        password: password,
        email: email
		});

		const result = await newUser.get(req.name)
		if(result.err) {
			return ctx.body = {
				code: 5000,
				msg: result.err
			};
		}
		if (result.list[0]) {
			return ctx.body = {
				code: 5000,
				msg: '用户已存在！'
			};
		}
		if (result.list[0]&&result.list[0].email == email) {
			return ctx.body = {
				code: 5000,
				msg: '该邮箱已注册！'
			};
		}
		const res = await newUser.save()
		if(result.err) {
			return ctx.body = {
				code: 5000,
				msg: result.err
			};
		}
		ctx.session.user = req;
		ctx.status = 200
		ctx.body = {
			code: 1000,
			user: '注册成功!'
		};
		
	} catch (e) {
		console.log(e)
	}
}

async function logout(ctx) {
	ctx.session.user = null;
	ctx.body = {
		code: 1000,
		msg: '登出成功!'
	};
}

module.exports = {
  "GET /api/user/info": getUserInfo, //获取用户信息
  "POST /api/user/login": login, //登陆
	"POST /api/user/register": register, //注册
	"POST /api/user/logout": logout
};

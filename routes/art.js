var crypto = require('crypto'),
    User = require('../models/user.js'),
		Post = require('../models/post.js'),
		multer = require('multer'),
		path = require('path');

module.exports = function(app) {

//---------------------文章模块---------------------
app.get('/api/article/list', function (req, res) {
  console.log("来调接口啦啦啦！！！")
  Post.getByPage(req.query, function (err, posts, total) {
    if (err) {
      posts = [];
      // res.status(500).json({data:err});
      res.send({code: 5000,msg: err});
    } 
    // console.log(posts)
    res.send({code: 1000, list: posts, total: total});
  });
});

// 文章详情
app.get('/api/article/detail', function (req, res) {
  Post.getOne(req.query, function (err, posts) {
    if (err) {
      res.send({code: 5000,msg: err});
    } 
    res.send({code: 1000,list: posts});
  });
});

//发表文章
app.post('/api/article/post', function (req, res) {
    var preview = req.body.post.slice(0,120);
    var currentUser = req.session.user,
        post = new Post(currentUser.name, req.body.title, req.body.post, preview, req.body.htmlCont);
    post.save(function (err) {
      if (err) {
          // req.flash('error', err); 
          // return res.redirect('/');
          res.send({code: 5000,msg: err});
      }
      // req.flash('success', '发布成功!');
      // res.redirect('/');//发表成功跳转到主页
      res.send({code: 1000,data: '发布成功!'});
    });
});

//更新文章
app.post('/api/article/edit', function (req, res) {
	
    var preview = req.body.post.slice(0,120);
    var currentUser = req.session.user,
				post = new Post(currentUser.name, req.body.title, req.body.post, preview, req.body.id);
				// console.log(post)
    post.edit(req.body, function (err) {
      if (err) {
          res.send({code: 5000,msg: err});
      }
      res.send({code: 1000,data: '发布成功!'});
    });
});

//文件上传
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
			cb(null, path.join(__dirname,'../public/images/'))
	},
	filename: function(req, file, cb) {
			var fileFormat = (file.originalname).split(".");
			cb(null, fileFormat[0] + Date.now() + "." + fileFormat[fileFormat.length - 1]);//'-' + Date.now() +   "." + fileFormat[fileFormat.length - 1]
	}
});
var upload = multer({
	storage: storage
});
app.post('/api/article/upload',upload.array('file[]'),function (req, res) {
	console.log(multer)
	console.log(req.files);
	console.log('res!!!!!!!!!!!!')
	// console.log(res)
	
	let result = {};
	result.succMap = {};
	for(let i=0; i<req.files.length; i++){
		result.succMap[req.files[i].filename] = req.files[i].path
	}
	result.errFiles = []
	// result.succMap[req['file[]'].originalname] = req['file[]'].path

	// res.send({
	// 	code: 0,
	// 	msg: '',
	// 	data: {
	// 		errFiles: [],
	// 		succMap: {
	// 			'flow-300x224.png': 'http://tech.etouch.cn/wp-content/uploads/2019/08/flow-300x224.png'
	// 		}
	// 	}
	// })
	res.send({code: 0,msg: '',data: result });
});

//添加评论 
app.post('/api/article/comment',function (req, res) {
	
	var post = new Post();
	post.saveComts(req.body, function (err) {
		if (err) {
			res.send({code: 5000,msg: err});
		}
		res.send({code: 1000,data: '评论发出去啦!'});
	})
});

//---------------------用户模块--------------------- 成功信息放入data，失败信息放入msg,列表放入list[]，用户信息放入user,后面封装一下

// app.get('/api/user/info', checkLogin);
app.get('/api/user/info', function (req, res) {
  if (req.session.user){
    res.send({code: 1000,user: req.session.user});
  }else{
    res.send({code: 1000,user: null});
  }
});

// app.post('/api/user/login', checkNotLogin);
app.post('/api/user/login', function (req, res) {
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    User.get(req.body.name, function (err, user) {
      if (!user) {
        res.send({code: 5000,msg: '用户不存在!'});
      }
      if (user.password != password) {
        res.send({code: 5000,msg: '密码错误!'});
      }
      req.session.user = user;
      res.send({code: 1000,user: user});
    });
});

//注册
// app.post('/api/user/register', checkNotLogin);
app.post('/api/user/register', function (req, res) {
    var name = req.body.name,
        email = req.body.email,
        password = req.body.password,
        password_re = req.body['password-repeat'];
    if (password_re != password) {
      res.send({code: 5000,msg: '两次输入的密码不一致!'});
    }
    var md5 = crypto.createHash('md5'),
        password = md5.update(req.body.password).digest('hex');
    var newUser = new User({
        name: name,
        password: password,
        email: email
    });
    User.get(newUser.name, function (err, user) {
      console.log("user!!!!!")
      console.log(user)
      if (err) {
        res.send({code: 5000,msg: err});
      }
      if (user) {
        res.send({code: 5000,msg: '用户已存在！'});
      }
      if (user&&user.email == email) {
        res.send({code: 5000,msg: '该邮箱已注册！'});
      }
      newUser.save(function (err, user) {
        if (err) {
          res.send({code: 5000,msg: err});
        }
        req.session.user = user;
        res.send({code: 1000,msg: '注册成功'});
      });
    });
});

//登出
// app.post('/api/user/logout', checkLogin);
app.post('/api/user/logout', function (req, res) {
    req.session.user = null;
    res.send({code: 1000,msg: '登出成功'});
});






// app.get('/', function (req, res) {
//     console.log(Post)
//     Post.get(null, function (err, posts) {
//         if (err) {
//           posts = [];
//         } 
//         res.render('index', {
//           title: '主页',
//           user: req.session.user,
//           posts: posts,
//           success: req.flash('success').toString(),
//           error: req.flash('error').toString()
//         });
//       });
// });

// app.get('/reg', checkNotLogin);
// app.get('/reg', function (req, res) {
//     res.render('reg', {
//       title: '注册',
//       user: req.session.user,
//       success: req.flash('success').toString(),
//       error: req.flash('error').toString()
//     });
// });

// app.post('/reg', checkNotLogin);
// app.post('/reg', function (req, res) {
//     var name = req.body.name,
//         password = req.body.password,
//         password_re = req.body['password-repeat'];
//     if (password_re != password) {
//       req.flash('error', '两次输入的密码不一致!'); 
//       return res.redirect('/reg');
//     }
//     var md5 = crypto.createHash('md5'),
//         password = md5.update(req.body.password).digest('hex');
//     var newUser = new User({
//         name: name,
//         password: password,
//         email: req.body.email
//     });
//     User.get(newUser.name, function (err, user) {
//       if (err) {
//         req.flash('error', err);
//         return res.redirect('/');
//       }
//       if (user) {
//         req.flash('error', '用户已存在!');
//         return res.redirect('/reg');
//       }
//       newUser.save(function (err, user) {
//         if (err) {
//           req.flash('error', err);
//           return res.redirect('/reg');
//         }
//         req.session.user = user;
//         req.flash('success', '注册成功!');
//         res.redirect('/');
//       });
//     });
// });

// app.get('/login', checkNotLogin);
// app.get('/login', function (req, res) {
//     res.render('login', {
//       title: '登录',
//       user: req.session.user,
//       success: req.flash('success').toString(),
//       error: req.flash('error').toString()
//     }); 
// });

// app.post('/login', checkNotLogin);
// app.post('/login', function (req, res) {
//     var md5 = crypto.createHash('md5'),
//         password = md5.update(req.body.password).digest('hex');
//     User.get(req.body.name, function (err, user) {
//       if (!user) {
//         req.flash('error', '用户不存在!'); 
//         alert('用户不存在!');
//         return res.redirect('/login');
//       }
//       if (user.password != password) {
//         req.flash('error', '密码错误!'); 
//         alert('密码错误!');
//         return res.redirect('/login');
//       }
//       req.session.user = user;
//       alert('登陆成功!')
//       req.flash('success', '登陆成功!');
//       res.redirect('/');
//     });
// });

// app.get('/post', checkLogin);
// app.get('/post', function (req, res) {
//     res.render('post', {
//       title: '发表',
//       user: req.session.user,
//       success: req.flash('success').toString(),
//       error: req.flash('error').toString()
//     });
// });



// app.get('/logout', checkLogin);
// app.get('/logout', function (req, res) {
//     req.session.user = null;
//     req.flash('success', '登出成功!');
//     res.redirect('/');
// });

// //文件上传
// app.get('/upload', checkLogin);
// app.get('/upload', function (req, res) {
//   res.render('upload', {
//     title: '文件上传',
//     user: req.session.user,
//     success: req.flash('success').toString(),
//     error: req.flash('error').toString()
//   });
// });

// function checkLogin(req, res, next) {
//     if (!req.session.user) {
//       req.flash('error', '未登录!'); 
//       res.redirect('/login');
//     }
//     next();
// }

// function checkNotLogin(req, res, next) {
//     if (req.session.user) {
//       req.flash('error', '已登录!'); 
//       res.redirect('back');
//     }
//     next();
// }

};


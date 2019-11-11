var Post = require('../models/post.js'),
		multer = require('multer'),
		path = require('path');

async function getArtList(ctx) {
	try {
		const result = await Post.getByPage(ctx.query)
		if (result.err) {
			ctx.body = {
				code: 5000,
				msg: result.err
			};
		} 
		ctx.status = 200
		ctx.body = {
			code: 1000,
			list: result.posts,
			total: result.total
		};
	} catch (e) {
		console.log(e)
	}
}

async function getArtDetail(ctx) {
	try {
		console.log("ctx.query~~~")
		console.log(ctx.query)
		const result = await Post.getOne(ctx.query)
		if (result.err) {
			ctx.body = {
				code: 5000,
				msg: result.err
			};
		} 
		ctx.status = 200
		ctx.body = {
			code: 1000,
			list: result.list
		};
	} catch (e) {
		console.log(e)
	}
}

async function postArt(ctx) {
	try {
		console.log(ctx.request.body)
		console.log(ctx.session)

		let req = ctx.request.body;
		let preview = req.post.slice(0,120);
    let currentUser = ctx.session.user,
    	reqPost = new Post(currentUser.name, req.title, req.post, preview, req.htmlCont);

		const result = await Post.save(reqPost)
		if (result.err) {
			ctx.body = {
				code: 5000,
				msg: result.err
			};
		} 
		ctx.status = 200
		ctx.body = {
			code: 1000,
			data: '发布成功!'
		};
	} catch (e) {
		console.log(e)
	}
}

async function editArt(ctx) {
	try {
		console.log(ctx.request.body)
		console.log(ctx.session)

		let req = ctx.request.body;
		let preview = req.post.slice(0,120);
    let currentUser = ctx.session.user,
    	reqEdit = new Post(currentUser.name, req.title, req.post, preview, req.id);

		const result = await Post.edit(reqEdit)
		if (result.err) {
			ctx.body = {
				code: 5000,
				msg: result.err
			};
		} 
		ctx.status = 200
		ctx.body = {
			code: 1000,
			data: '发布成功!'
		};
	} catch (e) {
		console.log(e)
	}
}

async function addCommit(ctx) {
	try {
		console.log(ctx.request.body)

		let req = ctx.request.body;

		const result = await Post.saveComts(req)
		if (result.err) {
			ctx.body = {
				code: 5000,
				msg: result.err
			};
		} 
		ctx.status = 200
		ctx.body = {
			code: 1000,
			data: '评论发出去啦!'
		};
	} catch (e) {
		console.log(e)
	}
}

//文件上传
async function upload(ctx) {
	try {
		let req = ctx.request.body;
		let storage = multer.diskStorage({
			destination: function(req, file, cb) {
					cb(null, path.join(__dirname,'../public/images/'))
			},
			filename: function(req, file, cb) {
					const fileFormat = (file.originalname).split(".");
					cb(null, fileFormat[0] + Date.now() + "." + fileFormat[fileFormat.length - 1]);//'-' + Date.now() +   "." + fileFormat[fileFormat.length - 1]
			}
		});
		let upload = multer({
			storage: storage
		});
		
		//上传文件
		upload.array('file[]');

		let result = {};
		result.succMap = {};
		for(let i=0; i<req.files.length; i++){
			result.succMap[req.files[i].filename] = req.files[i].path
		}
		result.errFiles = []

		ctx.body = {
			code: 0,
			msg: '',
			data: result 
		};

	} catch (e) {
		console.log(e)
	}
}
	
module.exports = {
  "GET /api/article/list": getArtList, //文章列表
  "GET /api/article/detail": getArtDetail, //文章详情
  "POST /api/article/post": postArt, //发表
	"POST /api/article/edit": editArt, //更新文章
	"POST /api/article/upload": upload, // 文件上传
	"POST /api/article/comment": addCommit,// 添加评论
};
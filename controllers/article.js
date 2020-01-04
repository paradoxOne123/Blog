let Post = require('../models/post.js'),
		path = require('path');
		fs = require('fs');

async function getArtList(ctx) {
	try {
		const result = await Post.getByPage(ctx.query)
		if (result.err) {
			return ctx.body = {
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
			return ctx.body = {
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
			return ctx.body = {
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
			return ctx.body = {
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
			return ctx.body = {
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
		const file = ctx.request.files['file[]']; // 获取上传文件
		// 创建可读流
		const reader = fs.createReadStream(file.path);
		const tmp = new Date().getTime()
		let filePath = path.join(__dirname, '../public/upload/images') + `/${tmp}_${file.name}`;
		let remfileUrl = 'http://paradoxone.club/upload/images' + `/${tmp}_${file.name}`;
		// 创建可写流
		const upStream = fs.createWriteStream(filePath);
		// 可读流通过管道写入可写流
		reader.pipe(upStream);
		
		let result = {};
		result.succMap = {};
		// for(let i=0; i<req.files.length; i++){
			result.succMap[file.name] = remfileUrl
		// }
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
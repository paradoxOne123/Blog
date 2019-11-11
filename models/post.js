let Db = require('./db').Db;
let mongodb = new Db();
let markdown = require('markdown').markdown;
let ObjectId = require('mongodb').ObjectID;



function Post(name, title, post, preview, id, htmlCont) {
    this.name = name;
    this.title = title;
    this.post = post;
		this.preview = preview;
		this.id = id;
		this.htmlCont = htmlCont;
		// this.comments = comments //评论
}
  
module.exports = Post;

//为文章插入评论 分为两级，文章评论与评论回复，放入replays[]下、
Post.saveComts = async function(query) {
	let date = new Date();
	//存储各种时间格式，方便以后扩展
	let time = {
			date: date,
			year : date.getFullYear(),
			month : date.getFullYear() + "-" + (date.getMonth() + 1),
			day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	}
	query.time = time.minute;

	const result = await mongodb.updateComt(query,'posts')
	return result
};
  
//存储一篇文章及其相关信息
Post.save = async function(query) {
    let date = new Date();
    //存储各种时间格式，方便以后扩展
    let time = {
			date: date,
			year : date.getFullYear(),
			month : date.getFullYear() + "-" + (date.getMonth() + 1),
			day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
			minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
			date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
    }
    //要存入数据库的文档
    // let post = {
		// 	name: this.name,
		// 	time: time,
		// 	title: this.title,
		// 	post: this.post,
		// 	preview: this.preview,
		// 	htmlCont: this.htmlCont
		// };
		query.time = time;

		const result = await mongodb.insert(query,'posts')
		return result
};

//更新文章内容
Post.edit = async function(query, callback) {
	console.log(query)
	let date = new Date();
	//存储各种时间格式，方便以后扩展
	let time = {
		date: date,
		year : date.getFullYear(),
		month : date.getFullYear() + "-" + (date.getMonth() + 1),
		day : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute : date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + 
		date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) 
	}
	console.log("query!!!!!!!!!!!!!!!!")
	console.log(query)

	query.time = time
	const result = await mongodb.update(query,'posts')
	return result

};
  
//读取文章及其相关信息
// Post.get = function(query, callback) {
//     mongodb.find(query,'posts',function(err,result){
//       console.log(result)
//       console.log(err)
//         if (err) {
//            return callback(err);//错误，返回 err 信息
//          }
//          //解析 markdown 为 html
//         result.forEach(function (doc) {
//             doc.post = markdown.toHTML(doc.post);
//         });

//         callback(null, result);//成功！err 为 null，并返回存储后的用户文档
//     });
// };

Post.getOne = async function(query) {
	console.log("getOne query~~~~~~~~~~~")
	console.log(query)
	const result = await mongodb.find({"_id": ObjectId(query.id)},'posts')
	return result
};

//一次获取十篇文章
Post.getByPage = async function(query) {
		let filter = {}
		//筛选项处理 range: 0,//筛选项，0:全部 1:我发布的
		if(query.range === '1'){
			filter.name = query.name
		}
		const result = await mongodb.findByPage(filter,query,'posts')
		return result
};
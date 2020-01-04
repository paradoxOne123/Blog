var MongoClient = require('mongodb').MongoClient;
var settings = require('../settings');
let ObjectId = require('mongodb').ObjectID;

// function Db(db, url, server, pool){
// 	this.db = db;
// 	this.url = url; 
// 	// this.server = server; 
// 	this.pool = pool; 
// }
function Db(){
	this.url = settings.url;
}
//创建数据库连接池
const factory = {
  create: function() {// return 的返回值作为pool.acquire().then(）的返回值
		console.log("create pool!!!!!!!~~~~~~~~~~~")
		var dbclient = MongoClient.connect(settings.url)
		return dbclient
  },
  destroy: function(client) {
		console.log("destroy pool!!!!!!!~~~~~~~~~~")
    client.disconnect();
  }
};
 
const opts = {
  max: 100, // maximum size of the pool
	min: 2, // minimum size of the pool
	log: true
};

var genericPool = require('generic-pool');
var pool = genericPool.createPool(factory, opts)


Db.prototype.open = function(cb){
	MongoClient.connect(this.url, function(err, db) {
		if (err) {
      return callback(err);
		}
		cb(null,db);
	});
}
Db.prototype.close = function(db){
	db.close();
}
Db.prototype.insert = async function(data,col){
    console.log("insert开始");
    //插入数据
    // var insertData = function(db,callback) {
    //     //连接到表col
    //     console.log("连接到表col");
    //     var collection = db.collection(col);
    //     //插入数据
    //     collection.insert(data, function(err, result) {
    //         if(err)
    //         {
    //             console.log('Error:'+ err);
    //             return cb(err);
    //         }     
    //         callback(null,result);
    //     });
		// }
		return new Promise((resolve, reject) => {
			pool.acquire().then(function(db){
					const collection = db.collection(col);
					//插入数据
					collection.insert(data, function(err, result) {
						if(err){
							reject(err)
						}     
						pool.release(db);
						resolve({err:null})
						// callback(null,result);
					});

					// insertData(db, function(newerr,result) {
					//     console.log("insertData")
					// 		// db.close();
					// 		pool.release(db);
					//     cb(null,result);
					// });
			});
	})
}

Db.prototype.updateComt = async function(data,col){
	return new Promise((resolve, reject) => {
		let query = data;
		//新增评论则新建ID
		if(query.mode === 1){
			query.comtid = new Date().getTime().toString(16);//评论ID 
		}
		
		//评论数据
		let comments = {
			comtid: query.comtid,
			atuser: query.atuser,
			// atuserid: query.atuserid,
			cont: query.cont,
			username: query.username,
			userid: query.userid,
			time: query.time
		}

		//status=1则插入comments, status=2则根据comtid获取对应comment，插入 replays,
		pool.acquire().then(function(db){
			//读取 posts 集合
			db.collection('posts', function (err, collection) {
				if (err) {
					pool.release(db);
					reject(err);
				}
				if(query.mode === 1){ //评论文章
					console.log("评论文章")
					collection.update({
						"name": query.author,
						"title": query.title
					}, {
						$push: {
							"comments": {
								$each:[comments],
								$position:0  //在头部插入，支持mogodb2.6之后
							}
						}
					}, function (err) {
						pool.release(db);
						if (err) {
							reject(err);
						}
						resolve({err:null})
					});
				}else{ //评论回复
					console.log("评论回复")
					collection.update({
						"comments.comtid": query.comtid,
						"name": query.author,
						"title": query.title
					}, {
						$push: {
							"comments.$.replays": {
								$each:[comments],
								$position:0  //在头部插入，支持mogodb2.6之后
							}
						}
					}, function (err) {
						pool.release(db);
						if (err) {
							reject(err);
						}
						resolve({err:null})
					});
		
				}
			});
		});
	})
}

Db.prototype.update = async function(data,col){
	return new Promise((resolve, reject) => {
		pool.acquire().then(function(db){
			const collection = db.collection(col);

			collection.update({
				"_id": ObjectId(data.id)
			}, {
				$set: {
					"title": data.title,
					"post": data.post,
					"time": data.time,
					"preview": data.preview
				}
			}, function (err) {
				pool.release(db);
				if (err) {
					reject(err)
				}
				resolve({err:null})
			});
		})
	})
}
//查找数据
Db.prototype.find = async function(data,col){
	return new Promise((resolve, reject) => {

		pool.acquire().then(function(db){
			console.log("pool.size: "+pool.size)// returns number of resources in the pool
			console.log("pool.available: "+pool.available)// returns number of unused resources in the pool
			console.log("pool.borrowed: "+pool.borrowed)// number of resources that are currently acquired by userland code
			console.log("pool.pending: "+pool.pending)// returns number of callers waiting to acquire a resource

			//连接到表
			const collection = db.collection(col);
			//查询数据
			let whereStr = data;
			collection.find(whereStr).sort({
					time: -1
			}).toArray(function(err, arr) {
					if(err){
						reject(err)
					} 
					pool.release(db);
					resolve({err:null, list:arr})
			});
		})
		.catch(function(err) {
			console.log(err)
			reject(err)
		});
	})
}
//分页查找数据
Db.prototype.findByPage = async function(filter,data,col){
  return new Promise((resolve, reject) => {
		const whereStr = data;
      //打开数据库
		pool.acquire().then(function(db){

			console.log("pool.size: "+pool.size)// returns number of resources in the pool
			console.log("pool.available: "+pool.available)// returns number of unused resources in the pool
			console.log("pool.borrowed: "+pool.borrowed)// number of resources that are currently acquired by userland code
			console.log("pool.pending: "+pool.pending)// returns number of callers waiting to acquire a resource

      const collection = db.collection(col);
      //使用 count 返回特定查询的文档数 total
      collection.count(filter, function (err, total) {

        collection.find(filter,{
          skip: ((whereStr.page - 1)*whereStr.count)*1,
          limit: whereStr.count*1
        }).sort({
          time: -1
        }).toArray(function (err, docs) {
          pool.release(db);
          if (err) {
						// return cb(err);
						reject(err)
          }
          //解析 markdown 为 html 目前不需要
          // docs.forEach(function (doc) {
          //   doc.post = markdown.toHTML(doc.post);
					// });  
					
					resolve({err:null, posts:docs, total:total})
          // return cb(null,docs,total);
        });
      });
  	});
	})
    
}

module.exports = {'Db':Db, 'Pool':pool};

// module.exports = function() {
//   return new Db(settings.db, settings.url, {safe: true, poolSize: 1}); //new Server(settings.host, settings.port),
// }

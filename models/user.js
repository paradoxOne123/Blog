let Db = require('./db').Db;
let mongodb = new Db();

function User (user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
}

module.exports = User;

//存储用户信息
User.prototype.save = async function (query) {
  //要存入数据库的用户文档
  let user = {
    name: this.name,
    password: this.password,
    email: this.email
  };

  const result = await mongodb.insert(user, 'users')
  return result
}

//读取用户信息
User.prototype.get = async function (name) {
  const result = await mongodb.find({ name: name }, 'users')
  return result

  // mongodb.find({name:name},'users',function(err,result){
  //     if (err) {
  //        return callback(err);//错误，返回 err 信息
  //      }
  //      callback(null, result[0]);//成功！err 为 null，并返回存储后的用户文档
  // });

};
# Blog
个人博客平台

后台框架：`node(KOA)`，数据库用的`mongodb`

前台页面`vue+element-ui`,client文件夹下

node启动： 
```javascript
  npm run autoStart
```

develop logs:

功能：
1. 兼容手机自适应样式 *****
2. 文章页刷新BUG *****
3. 数据库初始化连接池增加为10个 *****
4. 首页加载优化（图片大小）
5. 消息通知 (提交评论 -》形成消息(url,推送user,评论者，文章信息) -〉触发消息通知)
6. 分类搜索？
7. 个人主页


1.mongodb*****
进入命令行：  ./mongod   再./mongo 
Show dbs
Use 数据库名 
Show collections

db.collection.find({})//查询条件为多个健值对结构
update({}，{})//query,操作
.sort({“_id”:1}) //-1降序

db.posts.count(query)

var num = ObjectId(query._id)

使用mongodb命令怎么将数据插入到数组的指定位置?没有这种操作，因为MongoDB的底层就不支持这种操作。

增删改层级结构update: query条件，comments.$.replays(操作comments下的replays)   “comments.1”:”ee”（查找comments数组下的第二个元素是ee的数据）comments:{$size:2}(comments数组长度为2的数据)

对集合中内嵌的数组进行排序： （mySQL中组合查询，或者插入的时候就决定插入顺序）
aggregate？？
解决：
db.posts.update(
    {"name": "admin","title":"啦啦啦"},
    {
      $push: {
        "comments": {
          $each:[{"cont":"test11111111"}],
          $position:0}}})//支持mogodb2.6之后

数据库连接池：减小系统开销，原本是没次数据库操作都打开连接再关闭连接
创建连接池，
文档：https://www.npmjs.com/package/generic-pool


2.服务器上建数据库*****
远程连接服务器： ssh root@106.75.97.213  输入密码

**安装mongodb**

- curl -O https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-3.2.9.tgz
- tar zxvf mongodb-linux-x86_64-3.2.9.tgz
- mv /root/mongodb-linux-x86_64-3.2.9/* /usr/local/mongodb
- mkdir -p  /usr/local/mongodb/data    mkdir -p  /usr/local/mongodb/logs    touch /usr/local/mongodb/logs/mongod.log     touch /usr/local/mongodb/mongodb.conf
- Setting
- cd /usr/local/mongdb/bin
- 启动(bin目录下)： ./mongod --dbpath=/usr/local/mongodb/data --logpath=/usr/local/mongodb/logs/mongod.log  --logappend  --port=27017
- 软连接启动mongodb:  ln -s /usr/local/mongodb/bin/mongo /bin/mongo, 这样一来，不管在哪个目录下，只需使用"mongo"命令就可以进入MongoDB的shell 了。

    
**配置ngnix**

/etc/nginx/conf.d/
启动程序
/usr/local/nginx/sbin/nginx  或(配置)直接nginx
检查是否启动
ps -ef |grep nginx
检查端口信息
netstat -lntup |grep 80

nginx目录结构
conf #配置文件保存目录
html#站点目录
logs#nginx服务相关日志目录
sbin#服务命令目录

修改nginx配置文件：vim /usr/local/nginx/conf/nginx.conf
修改后重起生效：cd/usr/local/nginx/sbin/  nginx -s reload

配置反向代理： server 下的 proxypass

查看日志：/var/log/nginx  access.log  error.log

403 forbidden：

 
配置node接口后502:
反向代理到localhost:3389接口

解决：执行setsebool -P httpd_can_network_connect 1
￼
vi /etc/selinux/config 更改为：SELINUX=1

### ToDo list:
- 登陆相关优化
- 消息推送
- TS重构
- 高并发场景研究




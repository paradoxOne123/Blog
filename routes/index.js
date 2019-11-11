const router = require('koa-router')()
const fs = require('fs');
const path = require('path')

function addMapping(router, mapping) {
		const methods = [ 'HEAD', 'OPTIONS', 'GET', 'PUT', 'PATCH', 'POST', 'DELETE' ];
		for (var url in mapping) {
			var med = url.split(' ')[0].replace(/\s*/g,""),
			    count = 0;
			if(methods.indexOf(med) !== -1){
				count = med.length + 1;
				var path = url.substring(count);
				eval('router.'+ med.toLowerCase() + '(path, mapping[url])')
				// router.get(path, mapping[url]);
				console.log(`register URL mapping: ${med} ${path}`);
			}else {
				console.log(`invalid URL: ${url}`);
			}
		}
}

function addControllers(router, dir) {
		var files = fs.readdirSync(path.resolve(__dirname, '../controllers'));
		var js_files = files.filter((f) => {
				return f.endsWith('.js');
		});

		console.log(js_files)
		for (var f of js_files) {
				console.log(`process controller: ${f}...`);
				var filepath = path.resolve(__dirname, '../controllers/')
				let mapping = require(filepath + '/' +f);
				addMapping(router, mapping);
		}
}

function routerController (dir) {
    let controllers_dir = dir || 'controllers'; // 如果不传参数，扫描目录默认为'controllers'
    addControllers(router, controllers_dir);
    return router.routes();
};

module.exports = routerController;

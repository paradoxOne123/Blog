// import md5 from 'md5';

//点击复制到剪贴板
function copyToClipboard(s){
	if(window.clipboardData){
		window.clipboardData.setData('text',s);
	}else{
		(function(s){
				document.oncopy=function(e){
						e.clipboardData.setData('text',s);
						e.preventDefault();
						document.oncopy=null;
				}
		})(s);
		document.execCommand('Copy');
	}
}

function parseUrl() {
	var searchHref = window.location.href.split('?')[1];
	var params = searchHref.split('&');
	var returnParam = {};
	params.forEach(function(param) {
		var paramSplit = param.split('=');
		returnParam[paramSplit[0]] = paramSplit[1];
	});
	return returnParam;
}

export {
	copyToClipboard,
	parseUrl
};

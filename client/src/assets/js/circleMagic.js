export function circleMagic(options) {
	var width, height, canvas, ctx, animateHeader = true; 
	var circles = []; 
	var settings = { 
		radius: 30,
		density: .07,//密度
		color: 'random',
		clearOffset: .9
	}; 
	var container = document.getElementById('bgbox'); 
	initContainer(); 
	addListeners(); 
	function initContainer() {
		width = container.offsetWidth; 
		height = container.offsetHeight; 
		// initCanvas(); 
		canvas = document.getElementById('canvas'); 
		canvas.width = width; 
		canvas.height = height; 
		ctx = canvas.getContext('2d'); 
		for (var x = 0; x < width * settings.density; x++) { 
			var c = new Circle(); circles.push(c); 
		}
		animate();
	}
	// function initCanvas() { 
	// 	var canvasElement = document.createElement('canvas');
	// 	canvasElement.id = 'canvas'; 
	// 	container.appendChild(canvasElement); 
	// 	canvasElement.parentElement.style.overflow = 'hidden'; 
	// }
	function addListeners() { 
		window.addEventListener('scroll', scrollCheck, false); 
		window.addEventListener('resize', resize, false); 
	}
	function scrollCheck() {
		if (document.body.scrollTop > height) { 
			animateHeader = false; 
		}
		else { 
			animateHeader = true; 
		}
	}
	function resize() { 
		width = container.clientWidth; 
		height = container.clientHeight; 
		container.height = height + 'px'; 
		canvas.width = width; 
		canvas.height = height; 
	}
	function animate() {
		if (animateHeader) { 
			ctx.clearRect(0, 0, width, height); 
			for (var i in circles) { 
				circles[i].draw(); 
			} 
		}
		requestAnimationFrame(animate);//循环动画
	}
	//圆形随机颜色填充
	function randomColor() { 
		// var r = Math.floor(Math.random() * 255); 
		// var g = Math.floor(Math.random() * 255); 
		// var b = Math.floor(Math.random() * 255); 
		var r = 255; 
		var g = 255; 
		var b = 255; 
		var alpha = Math.random().toPrecision(2) * 0.5; 
		return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')'; 
	}
	//绘制圆形
	function Circle() {
		var that = this; 
		(function () { 
			that.pos = {}; 
			init(); 
		})(); 
		function init() {
			that.pos.x = Math.random() * width; //圆形起点
			that.pos.y = height + Math.random() * 100; 
			that.alpha = 0.1 + Math.random() * settings.clearOffset; 
			that.scale = 0.1 + Math.random() * 0.3; 
			//运动步长
			that.speed = Math.random() * 0.5; 
			if (settings.color === 'random') { 
				that.color = randomColor(); 
			}
			else { 
				that.color = settings.color; 
			}
		}
		this.draw = function () {
			if (that.alpha <= 0) { 
				init(); 
			}
			//上升高度限定
			if(that.pos.y < height/2.5){
				that.pos.y = height + Math.random() * 100
			}else{
				that.pos.y -= that.speed; 
			}
			
			that.alpha -= 0.0005; 
			ctx.beginPath(); 
			//画圆
			ctx.arc(that.pos.x, that.pos.y, that.scale * settings.radius, 0, 2 * Math.PI, false); 
			ctx.fillStyle = that.color; 
			ctx.fill(); 
			ctx.closePath();
		};
	}
}



//	canvas背景动画	
		// setTimeout( ()=>{

		
		// 	window.requestAnimFrame = (function () {
		// 			return window.requestAnimationFrame ||
		// 					window.webkitRequestAnimationFrame ||
		// 					window.mozRequestAnimationFrame ||
		// 					function (callback) {
		// 							window.setTimeout(callback, 1000 / 60);
		// 					};
		// 	})();
		// 	var can = document.getElementById("canvas");
		// 	var cxt = can.getContext("2d");
		// 	can.width = 1920;
		// 	can.height = 950;
		// 	cxt.lineWidth = 0.3;
		// 	//初始链接线条显示位置
		// 	var mousePosition = {
		// 			x: 30 * can.width / 100,
		// 			y: 30 * can.height / 100
		// 	}
		// 	//圆形粒子对象参数
		// 	var dots = {
		// 			n: 130,//圆形粒子个数
		// 			distance: 50,//圆形粒子之间的距离
		// 			d_radius: 100,//粒子距离鼠标点的距离
		// 			array: []//保存n个圆形粒子对象
		// 	}
		// 	//创建随即颜色值
		// 	function colorValue(min) {
		// 			return Math.floor(Math.random() * 255 + min);
		// 	}
		// 	function createColorStyle(r, g, b) {
		// 			return "rgba(" + r + "," + g + "," + b + ","+ Math.random()/2+ ")";
		// 	}
		// 	//混合两个圆形粒子的颜色
		// 	function mixConnect(c1, r1, c2, r2) {//圆的颜色 半径
		// 			return (c1 * r1 + c2 * r2) / (r1 + r2);
		// 	};
		// 	//生成线条的颜色
		// 	function lineColor(dot1, dot2) {//获取具体的圆的颜色再计算
		// 			var color1 = dot1.color,
		// 					color2 = dot2.color;
		// 			var r = mixConnect(color1.r, dot1.radius, color2.r, dot2.radius);
		// 			var g = mixConnect(color1.g, dot1.radius, color2.g, dot2.radius);
		// 			var b = mixConnect(color1.b, dot1.radius, color2.b, dot2.radius);
		// 			return createColorStyle(Math.floor(r), Math.floor(g), Math.floor(b));
		// 	}
		// 	//生成圆形粒子的颜色对象
		// 	function Color(min) {
		// 			min = min || 0;
		// 			// this.r = colorValue(min);
		// 			// this.g = colorValue(min);
		// 			// this.b = colorValue(min);
		// 			this.r = 230;
		// 			this.g = 230;
		// 			this.b = 230;
		// 			this.o = Math.random();
		// 			this.style = createColorStyle(this.r, this.g, this.b);
		// 	}
		// 	//创建圆形粒子对象
		// 	function Dot() {
		// 			//圆形粒子随机圆心坐标点
		// 			this.x = Math.random() * can.width;
		// 			// this.y = Math.random() * can.height;
		// 			this.y = can.height;
		// 			//x y 方向运动的速度值
		// 			this.vx = 3 + Math.random();
		// 			this.vy = 3 + Math.random();

		// 			this.radius = Math.random() * 20;
		// 			// this.color = "rgba(234, 230, 230, 0.88)";
		// 			this.color = new Color();
		// 	}
		// 	//绘制出圆形粒子
		// 	Dot.prototype.draw = function () {
		// 			cxt.beginPath();
		// 			cxt.fillStyle = this.color.style;
		// 			cxt.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);//y:can.height-100
		// 			cxt.fill();
		// 	}
		// 	//添加圆形粒子
		// 	function createCircle() {
		// 			for (var i = 0; i < dots.n; i++) {
		// 					dots.array.push(new Dot());
		// 			}
		// 	}
		// 	//绘制出圆形粒子
		// 	function drawDots() {
		// 			for (var i = 0; i < dots.n; i++) {
		// 					var dot = dots.array[i];
		// 					dot.draw();
		// 			}
		// 	}

		// 	//drawDots();
		// 	//移动
		// 	function moveDots() {
		// 			for (var i = 0; i < dots.n; i++) {
		// 					var dot = dots.array[i];

		// 					// dot.vx = dot.vx * Math.random() * 2;
		// 					dot.vy = Math.random() * Math.random() *10;
							
		// 					//当圆形粒子对象碰壁的时候就反弹回来
		// 					if (dot.y < 300 || dot.y > can.height) {
		// 							dot.y = can.height;
		// 							dot.x = Math.random() * can.width;
		// 					} else if (dot.x < 0 || dot.x > can.width) {
		// 							dot.vx = -dot.vx;
		// 							dot.vy = dot.vy;
		// 					}
		// 					//给圆形粒子圆心坐标加上速度值移动圆形粒子
		// 					// dot.x += dot.vx;
		// 					// dot.y += dot.vy;
		// 					dot.y -= dot.vy;
		// 			}
		// 	}
		// 	//链接粒子对象
		// 	function connectDots() {
		// 			for (var i = 0; i < dots.n; i++) {
		// 					for (var j = 0; j < dots.n; j++) {
		// 							var iDot = dots.array[i];
		// 							var jDot = dots.array[j];
		// 							if ((iDot.x - jDot.x) < dots.distance && (iDot.y - jDot.y) < dots.distance && (iDot.x - jDot.x) > -dots.distance && (iDot.y - jDot.y) > -dots.distance) {
		// 									if ((iDot.x - mousePosition.x) < dots.d_radius && (iDot.y - mousePosition.y) < dots.d_radius && (iDot.x - mousePosition.x) > -dots.d_radius && (iDot.y - mousePosition.y) > -dots.d_radius) {
		// 											cxt.beginPath();
		// 											//cxt.strokeStyle = "yellow";
		// 											cxt.strokeStyle = lineColor(iDot, jDot);
		// 											// cxt.moveTo(iDot.x, iDot.y);
		// 											cxt.moveTo(0, 0);
		// 											// cxt.lineTo(jDot.x, jDot.y);
		// 											cxt.closePath();
		// 											cxt.stroke();
		// 									}

		// 							}
		// 					}
		// 			}
		// 	}
		// 	createCircle();
		// 	//让圆形粒子不断的移动
		// 	function animateDots() {
		// 			cxt.clearRect(0, 0, can.width, can.height);
		// 			moveDots();
		// 			connectDots()
		// 			drawDots();
		// 			requestAnimFrame(animateDots);
		// 	}
		// 	animateDots();

		// 	can.onmousemove = function (ev) {
		// 			var ev = ev || window.event;
		// 			mousePosition.x = ev.pageX;
		// 			mousePosition.y = ev.pageY;
		// 	}
		// 	can.onmouseout = function () {
		// 			mousePosition.x = can.width / 2;
		// 			mousePosition.y = can.height / 2;
		// 	}

	  // },0)
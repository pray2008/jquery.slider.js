/**
*
* 这其实是个用在手机端的插件，不过也支持IE9+, chrome, ff
* author: 樊玉龙
*
**/

(function(){
	var fan = fan || {};
	fan.slider = function(config){
		this.container = config.container;
		this.config = $.extend({
			timeDuration: 2, //how many seconds that animation will last
			autoSlide: true,
			autoSlideInterval: 4,
			triggerMoveDistance: 10, //大于这个值，　才会触发move
			triggerSliderDistance: 100, //大于这个值，才会触发滚动上下一页
			triggerMoveRate: 120, //1s移动大于这个距离，会触发滚动上下一页
		}, config);
	}


	fan.slider.prototype.init = function(){
		var listData = this.config.data,
			item,
			ul = $("<ul></ul>"),
			pages = $('<div class="my_slidder_postion"></div>');

		this.ul = ul;
		this.pages = pages;
		this.listLength = listData.length;
		this.listWidth = this.container.width();

		for (var i = 0; i < this.listLength; i++) {
			item = listData[i];
			ul.append(
				"<li>"+
					"<a href='"+ item.link +"'>"+
						"<img src='"+ item.img +"' />"+
						"<span>"+ item.title +"</span>"+
					"</a>"+
				"</li>"
			);
			this.pages.append("<span></span>");
		}

		this.container.append(this.ul);
		this.container.append(this.pages);
		this.pages.children().eq(0).addClass("on");
		this.addSliderEvents();
	};

	fan.slider.prototype.addSliderEvents = function(){
		var self = this,
		sliderData = {
			pos: 0,
			startTime: 0,
			endTime: 0,
			ignoreYMove: false,
			ignoreXMove: false,
			x1: null,
			y1: null,
			x2: null,
			y2: null,
			interval: null,
		},
		setCurrentPage = function() {
			self.pages.children().removeClass("on").eq(sliderData.pos).addClass("on");
		},
		getTransformText = function(sec) {
			return "transform "+ sec +"s";
		},
		getTranslateText = function(XD) {
			return "translate("+ (-sliderData.pos * self.listWidth + (XD || 0) ) +"px, 0)";
		},
		autoSlide = function() {
			sliderData.pos ++;
			if (sliderData.pos >= self.listLength) {
				sliderData.pos = 0;
			}
			self.ul.css({
				"-webkit-transition": getTransformText(2),
				"transform": getTranslateText()
			});
			setCurrentPage();
		},
		touchStart = function(e){
			e = e || event;
			var t = e.originalEvent ? e : e.originalEvent.touches[0];
			sliderData.x1 = t.clientX;
			sliderData.y1 = t.clientY;
			sliderData.startTime = new Date().getTime();
			clearInterval(sliderData.interval);
			e.preventDefault();
		},
		touchMove = function(e){
			e = e || event;
			var t = e.originalEvent ? e : e.originalEvent.touches[0];
			if (sliderData.startTime === 0) {
				return;
			}
			sliderData.x2 = t.clientX;
			//console.log(sliderData.x2);
			sliderData.y2 = t.clientY;
			if (!sliderData.ignoreYMove && Math.abs(sliderData.y2 - sliderData.y1) > self.config.triggerMoveDistance) {
				sliderData.ignoreXMove = true;
			}
			if (!sliderData.ignoreXMove && Math.abs(sliderData.x2 - sliderData.x1) > self.config.triggerMoveDistance) {
				sliderData.ignoreYMove = true;
			}
			//means x move triggered
			if (sliderData.ignoreYMove) {
				var XD = sliderData.x2 - sliderData.x1;
				self.ul.css({
					"-webkit-transition": getTransformText(0),
					"transform": getTranslateText(XD)
				});
			}
			e.preventDefault();
		},
		touchEnd = function(e){
			if (sliderData.startTime === 0) {
				return;
			}
			sliderData.endTime = new Date().getTime();
			var xDistance = sliderData.x2 - sliderData.x1;
			var goSlider = function() {
				if (sliderData.pos < 0)
					sliderData.pos = 0;
				if (sliderData.pos >= self.ul.children().length)
					sliderData.pos = self.ul.children().length-1;
				self.ul.css({
					"-webkit-transition": getTransformText(0.5),
					"transform": getTranslateText()
				});
				setCurrentPage();
				//防止链接
				self.ul.find("a").unbind("click").bind("click", function(){
					e.stopPropagation();
					e.preventDefault();
					return false;
				});
				setTimeout(function(){
					self.ul.find("a").unbind("click");
				}, 100);
			};

			if(!sliderData.ignoreXMove && 1000*Math.abs(xDistance)/(sliderData.endTime-sliderData.startTime) > self.config.triggerMoveRate) {
				sliderData.pos = sliderData.pos + (xDistance > 0 ? -1 : 1);
				goSlider();
			}
			else if (sliderData.ignoreYMove) {
				//跳转到下一页或复原
				if (Math.abs(xDistance) > self.config.triggerSliderDistance) {
					sliderData.pos = sliderData.pos + (xDistance > 0 ? -1 : 1);
				}
				goSlider();
			}
			


			sliderData.disableMove = false;
			sliderData.ignoreYMove = false;
			sliderData.ignoreXMove = false;
			sliderData.startTime = 0;
			sliderData.endTime = 0;
			sliderData.interval = setInterval(autoSlide, self.config.autoSlideInterval * 1000);
		};

		self.container
		.on("touchstart", touchStart)
		.on("touchmove", touchMove)
		.on("touchend", touchEnd)
		.on("mousedown", touchStart)
		.on("mousemove", touchMove)
		.on("mouseup", touchEnd);
		if (self.config.autoSlide) {
			sliderData.interval = setInterval(autoSlide, self.config.autoSlideInterval * 1000);
		}
	};
	
	$.fn.extend({
		"slider": function(config) {
			config.container = this;
			var $slider = new fan.slider(config);
			$slider.init();
			this.addClass("fan_slider").data("fan.slider", $slider);
			return $slider;
		}
	});
})();
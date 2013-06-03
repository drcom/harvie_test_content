$(function($)
{
	var has3d = 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(), hasTouch = 'ontouchstart' in window, hasGesture = 'ongesturestart' in window, hasCompositing = 'WebKitTransitionEvent' in window, isIDevice = (/iphone|ipad/gi).test(navigator.appVersion), isAndroid = (/android/gi).test(navigator.appVersion), RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize', START_EV = hasTouch ? 'touchstart' : 'mousedown', MOVE_EV = hasTouch ? 'touchmove' : 'mousemove', END_EV = hasTouch ? 'touchend' : 'mouseup', CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup', trnOpen = 'translate' + ( has3d ? '3d(' : '('), trnClose = has3d ? ',0)' : ')', m = Math;
	function touchScroll(el, options)
	{
		if(options==null)
			options={};
		this.init(el, options);
	}
	touchScroll.prototype =
	{
		
		init:function(el,options)
		{
			var opts=$.extend(
			{
				checkDOMChanges : true,
				hideScrollbar : false

			},options);
			$.extend(options,opts);
			iScroll.apply(this, [el[0], options]);
		}
	}
	touchScroll.prototype = $.extend(false, window.iScroll.prototype, touchScroll.prototype);
	$.fn.touchScroll = function(method)
	{

		var scroll = $(this).data("touchScroll", scroll);
		if(scroll == null)
		{
			$(this).data("touchScroll", new touchScroll($(this), method));
		}
		else
		{
			if(scroll[method])
			{
				return scroll[method](Array.prototype.slice.call(arguments, 1));
			}
			else
			{
				$.error('Method ' + method + ' does not exist on jQuery.touchScroll');
			}
		}

	};
	if(Drcom.controls==null)
		Drcom.controls={};
	Drcom.controls.scroll=touchScroll;
});

$(document).bind('menuReady', function () {	

	
	if(sessionStorage.getItem("showAllAsset8")==null)
	{
		sessionStorage.setItem("showAllAsset8",1);
		$(".btn_ok").addClass("active");
		$(".grey_chart").css('top','76px');
		setUp();
		
	}
	else
	{

		
		$(".btn_ok").removeClass("active");
		$(".grey_chart").css('top','74px');
		$(".blue_chart").addClass("transition").css("top",131);
		$(".btn_reload").addClass('reload');
		$('.percent').css("display","block");	
		$('.blue_percent').html("4.0%").css("display","block");		
			 
		setUp();	
		
		$(".bar .wrapper").draggable('disable');
	}
	
   function setUp(){
		$(".grey_chart").css('top','76px');

		$(".bar .wrapper").draggable({
			
			axis:"y",
			drag:function(event, ui)
			{
				var bar=ui.helper.parent();
				var top=event.offsetY;
				var fraction = 0;
				
				if(top>198)
				{
					top=198;
				}
				if(top<4)
				{
					top=4;
				}
				var percent=Math.round(Math.floor((196-top)/16));
				var fraction=Math.round((196-top)/1.6)-percent*10;

				$(".blue_chart",bar).css("top",top);
				$('.blue_percent').html(percent+"."+fraction+"%").css("display","block");
				
				return false;
			}
		});
		
		$(".btn_ok").bind('click',function(){
			$(this).removeClass('active');
			$(".blue_chart").addClass("transition").css("top",131);
			$(".btn_reload").addClass('reload');
			$('.blue_percent').html("4.0%").css("display","block");	
			$('.percent').css("display","block");	
			$(".bar .wrapper").draggable('disable');
		});	
		
		$('.btn_reload').bind('click',function(){
			if($('.btn_reload').hasClass('reload')){
				$(this).removeClass('reload');
				$(".btn_ok").addClass("active");
				$(".blue_chart").removeClass("transition").css("top",3);
				$('.percent').css("display","none");
				$('.blue_percent').css("display","none");
				$(".bar .wrapper").draggable('enable');
			}
		});
   }
   
   $.ui.draggable.prototype._mouseDrag= function(event, noPropagation) 
	{
			//Compute the helpers position
			this.position = this._generatePosition(event);
			this.positionAbs = this._convertPositionTo("absolute");
			
			//Call plugins and callbacks and use the resulting position if something is returned
			if (!noPropagation) {
				var ui = this._uiHash();
				if(this._trigger('drag', event, ui) === false) {
					return false;
				}
				this.position = ui.position;
			}
		
		if(!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left+'px';
		if(!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top+'px';
		if($.ui.ddmanager) $.ui.ddmanager.drag(this, event);
		
		return false;
   }
   
});
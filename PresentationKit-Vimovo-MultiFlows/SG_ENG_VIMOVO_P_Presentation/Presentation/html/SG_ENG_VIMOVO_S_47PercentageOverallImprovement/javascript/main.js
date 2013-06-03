//$(document).bind('ready', function () {
$(document).bind('menuReady', function () {

	if(sessionStorage.getItem("showAllAsset5")==null)
	{
		$('.slide_num').addClass('active');
		setUp();
		$('.line_2colbg').css('display','block');
		sessionStorage.setItem("showAllAsset5",1);
	}
	else
	{

		
		$('.btn_reload').addClass('reload');
		$('.num005').css('display','block');
			
		$(".line_3col").show('slide',{direction : 'down'},1000,function(){
			$('.chart_numcol3').fadeIn(500);
		});
		$(".line_3shadow").show('slide',{direction : 'up'},1000,function(){
		});

		setUp();	
		$('.line_2colbg').css('display','block');
		

		
	}
});

function setUp(){
	$(".line_2col").show('slide',{direction : 'down'},1000,function(){
		$('.chart_numcol1, .chart_numcol2').fadeIn(500);
	});
		
	$('.ok').bind('click',function(){
		$('.btn_reload').addClass('reload');
		$('.slide_num').removeClass('active');
		$('.num005').css('display','block');
			
		$(".line_3col").show('slide',{direction : 'down'},1000,function(){
			$('.chart_numcol3').fadeIn(500);
		});
			$(".line_3shadow").show('slide',{direction : 'up'},1000,function(){
		});
	});
	
	initScrollNumber();
		 
	$('.btn_reload').bind('click',function(){
		$('.num005').css('display','none');
		$('.slide_num').addClass('active');
			 
		if($('.btn_reload').hasClass('reload')){
			$('.btn_reload').removeClass('reload');
			$(".line_3col").hide('slide',{direction : 'down'},1000,function(){
				$('.chart_numcol3').fadeOut(500);
			});
				$(".line_3shadow").hide('slide',{direction : 'up'},1000,function(){
			}); 
		}
	});
}

function initScrollNumber() {
        
    $("#number_scroll .scroller").append($("<ul>"));
	for(var i=0;i<=100;i++)
	{
		var text=i<10?"0"+i:i;
		var html=drcom.u.template("<li value='<%=value%>'><%=name%></li>")({
			name:text,
			value:i
		});
		$("#number_scroll ul").append(html);
	}

    $('#number_scroll').drcom_controls_picker({
		value:0
    });
	$('#number_scroll').drcom_controls_picker().val(100,0);
	
	//popup
	$(".btn_micro, .btn_plus").drcom_popup({
		closeInside: false,
		oneInstance: false,
		onHide: function(){
			$('#main_container').fadeIn();
		},
		onBeforeShow:function()
		{
			$('#main_container').hide();
			
		}
	});

}

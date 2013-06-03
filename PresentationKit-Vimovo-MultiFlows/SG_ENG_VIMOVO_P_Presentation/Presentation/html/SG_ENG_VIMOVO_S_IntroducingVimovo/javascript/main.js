//$(document).ready( function () {

$(document).bind('menuReady', function () {
	
	
	
	
	var count=0;
	
	$('.click_zone').click(function(){
		count++;
		
		$(".btn_reload").addClass("reload");
		if(count==1)
			$('.line004').fadeIn();
		if(count==2)
			$('.line004_2').fadeIn();

	});
	$('.btn_reload').bind('click',function(){

		$('.line004, .line004_2').fadeOut();
		$(this).removeClass('reload');
		count=0;
	})
	
	var myVideo=document.getElementById("video_moa"); 

	$('.btn_video004').bind('click',function(){
		$('.video_moa').show();
		video.playpause();
		video.fullscreen();
		var player = $('.video_moa video')[0];
		//player.addEventListener('webkitbeginfullscreen', onVideoBeginsFullScreen, false);
		player.addEventListener('webkitendfullscreen', onVideoEndsFullScreen, false);
	});
	var video = $('.video_moa').drcom_video().controller();
	console.log(video);
    function onVideoEndsFullScreen(){
		$('.video_moa').hide();
		video.playpause();
		console.log('end fullscreen');
	}
});

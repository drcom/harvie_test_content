$(document).bind('menuReady', function(){
	$("#container").delegate(".scroll_ref .close",'click',closeRef);
	$("#container").delegate(".scroll_info .close",'click',closeInfo);
	

	drcom.navigator.addButton("ref",'showRef');
	drcom.navigator.addButton("info",'showInfo');
}); 


$(document).bind('slideChange', function() {
	closeRef();
	closeInfo();
});

$(document).bind("menuReady",function(ev,slideId){
	var slideName=drcom.navigator.getData("slideName");
	if($(".scroll_ref").length>0)
		drcom.navigator.enableButton("ref");
	else
		drcom.navigator.disableButton("ref");
	if($(".scroll_info").length>0)
		drcom.navigator.enableButton("info");
	else
		drcom.navigator.disableButton("info");
})


function closeInfo(){
	drcom.navigator.deactiveButton("info");
	$(".info_wrapper").css('display','none');
	$(".scroll_info").css('display','none');
}

function closeRef(){
	drcom.navigator.deactiveButton("ref");
	$(".ref_wrapper").css('display','none');
	$(".scroll_ref").css('display','none');
}

function showRef()
{
	closeInfo();
	
	var content=$(".ref_wrapper");
	if(content.is(":visible"))
	{
		closeRef();
	}
	else
	{
		
		drcom.navigator.activeButton("ref");
		$(".ref_wrapper").stop().fadeIn();
		$(".scroll_ref").stop().fadeIn();		
	}
}

function showInfo()
{

	closeRef();
	
	var content=$(".scroll_info");
	if(content.is(":visible"))
	{
		closeInfo();
	}
	else
	{
		drcom.navigator.activeButton("info");
		$(".info_wrapper").stop().fadeIn();
		$(".scroll_info").stop().fadeIn();
	}
}
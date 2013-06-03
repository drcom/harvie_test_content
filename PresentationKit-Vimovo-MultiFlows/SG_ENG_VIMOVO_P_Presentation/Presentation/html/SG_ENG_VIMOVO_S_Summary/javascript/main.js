$(document).bind('menuReady', function () {	
	

	$('.text_top').click(function(){
		SystemBridge.goToAlternateCall("FlowA","FAQs");
    });	
	$('.text_bottom').click(function(){
		SystemBridge.goToAlternateCall("FlowB");
    });	
	
});
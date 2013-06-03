$(".pdf_pi").bind("ready",function() {
	var slideName=drcom.navigator.getData("slideName");
	var asset=$("."+slideName);
	function removeStyle(el, property) {
		$(el).each(function(){
			var style = $(this).attr("style");
			if(style==undefined)
				return;
			var pattern = style.split(";");
			for (var i in property) {
				for (var j in pattern) {
					var pattern2 = pattern[j].split(":");
					
					if (property[i] == pattern2[0].trim()) {
						pattern.splice(j, 1);
						break;
					}
					
				}
			}
			$(this).attr("style", pattern.join(";"));		
		})

	}
	drcom.navigator.disableSwipe();
	drcom.navigator.hideMenu();
	removeStyle("#content,#container,."+slideName,["-webkit-transform","height","width","overflow","position","overflow-x","overflow-y"]);
	$("#container").css({
		height:"auto",
		width:"auto",
		overflow:"visible",
		position:"static"
	});
	var file="presentation/assets/"+slideName+"/index.pdf";
	
	var heightPerPage=800.45;
	if(navigator.userAgent.match(/OS 4_.*\ like Mac OS X/i))
		heightPerPage=800.45;
	$("#pdf",asset).drcom_pdf({
		pageTotal : 25,
		src : file,
		heightPerPage:heightPerPage,
		widthPerPage:610,
	});
	$("#controls_pdf",asset).drcom_pdf_control({
		object : $("#pdf",asset).controller(),
		autoHide:true,
		gotoPage:null,
		gotoSlide:function()
		{

			removeStyle("#container,#content",["height","width","position","overflow","overflow-x","overflow-y"])
			window.scroll(0,0);
			drcom.navigator.showMenu();
			drcom.navigator.enableSwipe();
			drcom.navigator.gotoSlide(drcom.navigator.getData('prevSlideNotPdf'));
		}
	});
});




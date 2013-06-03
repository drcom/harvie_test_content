$(document).bind('menuReady', function(){
	//------------Begin:Harvie
	var _gotoSlide=drcom.navigator.gotoSlide;
	var isHarvie= window.SystemBridge==null?false:true;	
	drcom.navigator.gotoSlide=function(slideId)
	{	
		if(isHarvie==false)
			return _gotoSlide.apply(this,arguments);
		var models=drcom.navigator.models;
		var slideName="";
		for(var i=0;i<models.length;i++)
		{
			if(models[i].id==slideId)
				slideName=models[i].getAttr("name");
				
		}		
		SystemBridge.goToSlide(slideName);
	}
	drcom.navigator.sendTracking=function(survey, question, answer){
		if(isHarvie)
			SystemBridge.submitSurveyResponse(survey, question, answer);
	}
	//------------End:Harvie
	
	
});
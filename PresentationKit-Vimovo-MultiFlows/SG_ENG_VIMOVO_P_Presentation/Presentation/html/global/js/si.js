ViewResponder = function(){};
ViewResponder._onLocationChange = function(newLoc)
{
  window.plugins.browser.onLocationChange(newLoc);
};
ViewResponder._onCallback = function(type, value)
{
  window.plugins.browser.onCallback(type, value);
};
ViewResponder._onCommandResponse = function(arguments)
{
  arguments = unescape(arguments);
  window.plugins.browser.onCommandResponse(arguments);
};
ViewResponder.install = function()
{
  if(!window.plugins)
  {
    window.plugins = {};	
  }
  window.plugins.browser = new ViewResponder();
  return window.plugins.browser;
};


$.Class("Menu.Class.SI",{
	init:function(){
		  var self = this;
            self.callStack = [];
            self.currentCallStack = 0;
            self.sendTimer = null;
            self.sending = false;
            self.zIndex = 0;
            self.previewLoaded = false;
            self.iframeCommand = $('<iframe/>', {
                'id': 'iframeCommand',
                'scrolling': 'no'
            }).css({
                'width': 0,
                'height': 0,
                'left': -9999,
                'top': -9999,
                'position': 'absolute'
            }).appendTo('body');
            viewresponder = ViewResponder.install();
            if (viewresponder) {
                viewresponder.onCommandResponse = function (args) { self.onCommandResponse(args); };
            }
	},
	 // only use for si
    onCommandResponse: function (arguments) {
        try {
            var params = arguments.split(":");
            args = $.evalJSON(drcom.utils.getData(params[1]));
            drcom.utils.removeData(params[1]);
            this.excuteCommand(params[0], args);
        } catch (e) {
        	console.log(e);
            //alert('onCommandResponse ' + e.message);
        }
    },
    excuteCommand: function (functionName, arguments) {
        if (!arguments) arguments = {};
        var args = Array.prototype.slice.call(arguments);
        var namespaces = functionName.split(".");
        var func = namespaces.pop();
        ns = namespaces.join('.');
        if (ns == '') {
            ns = 'window';
        }
        ns = eval(ns);
        return ns[func].apply(ns, args);
    },
    send: function (command, args, viewid) {
        var self = this,
        excludeCommands = ['setSharedInfo', 'getSharedInfo'];
        if (viewid && ($.inArray(command, excludeCommands) < 0)) {
            args = $.toJSON(args);
        };
        self.callStack.push([command, args, viewid]);
        if (!self.sending) self.sendQueue();
    },
    sendQueue: function (viewname) {
        var self = this,
        toSend = self.callStack[self.currentCallStack];
        self.sending = true;
        if (typeof toSend != 'undefined') {
            var viewname = 'gap:NavigationBrowser:',
                command = 'command:';
            if (typeof toSend[2] != 'undefined') viewname = toSend[2] + ':ViewResponder:';
            if (typeof toSend[1] === 'string') {
                var date = new Date(),
        sendKey = toSend[0] + date.getTime() + '_' + Math.floor(Math.random() * 1000),
        sendArgs = sendKey;
                //alert("sendKey " + sendKey + ' | ' + toSend[1]);
                drcom.utils.saveData(sendKey, toSend[1]);

            } else {
                var sendArgs = toSend[1].join(':');
            }
            command += viewname + toSend[0] + ':' + sendArgs;
            self.iframeCommand.attr('src', command);
            self.sendTimer = setTimeout(function () {
                self.currentCallStack++;
                self.sendQueue();
            }, 0);
        } else {
            clearTimeout(self.sendTimer);
            self.callStack = [];
            self.currentCallStack = 0;
            self.sendTimer = null;
            self.sending = false;
        }
    }
});

$(document).bind("presentationReady",function(){
	drcom.views.send('showLoading', [false]);
});
$(document).bind("menuReady",function(){
	
	

	function formatDateTime(now){

		function formatNumberToString(number)
		{
			  var str = "";
			  if(number < 10){
			   str = "0" + number;
			  }else{
			   str = number;
			  }
			  return str;
		}
		  var currentTime = now.getFullYear() + "-" + formatNumberToString(now.getMonth() + 1) + "-" + formatNumberToString(now.getDate()) +  " " +  formatNumberToString(now.getHours()) + ":" +  formatNumberToString(now.getMinutes()) + ":" + formatNumberToString(now.getSeconds()) ;
		  return currentTime;
	};
	drcom.navigator.getPrezId=function(presentation)
	{
		drcom.presentation_id=presentation.presentation_id;
	};
	
	//call SI close presentation
	drcom.navigator.execClosePrez= function (type, value) {
		if (type == 'close') {
			drcom.views.send('closePresentation', [value]);
        }
        else if (type == 'switch') {
        	drcom.views.send('switchPresentation', [value]);
        }
	};
	//si call close presentation
	drcom.navigator.beforeClosePrez=function(value)
	{
		drcom.beforeClosePrez(value);
	};
	//si call switch presentation
	drcom.navigator.beforeSwitchPrez = function (value) {
		drcom.beforeSwitchPrez(value);
	};
	
	drcom.beforeGoToSlide= function (id, animation) {
		drcom.setTracking();
    },
	drcom.beforeClosePrez = function (value) {
	    this.beforeGoToSlide();
	    drcom.navigator.execClosePrez('close', value);
	};
	drcom.beforeSwitchPrez = function (value) {
	    this.beforeGoToSlide();
	    drcom.navigator.execClosePrez('switch', value);
	};

	drcom.setTracking=function()
	{
		var currentTime=new Date().getTime();
		if(drcom.tracking==null)
			drcom.tracking={};
		if(drcom.tracking.start_tracking==null)
		{
			drcom.tracking.start_tracking=currentTime;
			drcom.tracking.end_tracking=currentTime;
		}
		else
		{
			var duration = Math.round((currentTime - drcom.tracking.start_tracking)/1000);
	      	if(duration==0)
	      		duration=1;
	      	drcom.tracking.end_tracking=new Date(drcom.tracking.start_tracking+duration*1000).getTime();
			drcom.navigator.sendTracking("goto",duration);
		}
		drcom.tracking.start_tracking=drcom.tracking.end_tracking;
	},
	//send tracking
	drcom.navigator.sendTracking=function(action, datas)
	{
		
        if (datas === null || arguments.length < 2) {
            datas = action;
            action = 'survey';
        };
        var slide_name = this.getData('slideName');
        if (!slide_name) return false;
        
        if(drcom.tracking.end_tracking==null)
        		drcom.tracking.end_tracking=new Date();
        var presentation_id=drcom.presentation_id,start_at=formatDateTime(new Date(drcom.tracking.start_tracking) ),end_at=formatDateTime(new Date(drcom.tracking.end_tracking));
        var trackingDatas = {
        		presentation_id:presentation_id,
                slide_name: slide_name,
                action: action,
            	start_at:start_at,
            	end_at:end_at,
            	value:datas
            };
        var date = new Date();
        var trackingId = 'tracking_' + date.getTime() + '_' + Math.floor(Math.random() * 1000);
        localStorage.setItem(trackingId, JSON.stringify(trackingDatas));
        drcom.views.send('retrieve:localStorage', [trackingId]);
	};

	
	drcom.views=new Menu.Class.SI();
	//respone to si, i load complete
	drcom.views.send("loadComplete", [true]);
});
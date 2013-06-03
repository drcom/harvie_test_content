var _setup=$.Class.setup;
$.Class("Drcom.Class",{
	setup:function()
	{
		_setup.apply(this,[this._super,arguments]);
	},
	plugin:{
		add: function(module, option, set ) {
			var proto = module.prototype;
			if(proto.plugins==null)
				proto.plugins={};
			for ( var i in set ) {
				proto.plugins[ i ] = proto.plugins[ i ] || [];
				proto.plugins[ i ].push( [ option, set[ i ] ] );
			}
		},
		call: function( instance, name, args ) {
			var set = instance.plugins[ name ];
			if(set==undefined)
				return;
			for ( var i = 0; i < set.length; i++ ) {
				if ( instance.options[ set[ i ][ 0 ] ]==undefined  ||  instance.options[ set[ i ][ 0 ] ]===null) 
					continue;
				else
					if(set[i][1].apply(instance, args )===false)
						return false;
				
			}
		}
	}
},{
});
$.Controller("Drcom.Controller",{
	setup:function()
	{
		_setup.apply(this,[this._super,arguments]);
	},
	plugin:Drcom.Class.plugin
},{
	_trigger: function( type, event, data )
	{
		var callback = this.options[ type ],
			args;
		event = $.Event(event);
		event.type = ( type === this.Class._fullName ? type :this.Class._fullName + type ).toLowerCase();
		data = data || {};
		// copy original event properties over to the new event
		// this would happen if we could call $.event.fix instead of $.Event
		// but we don't have a way to force an event to be fixed multiple times
		if ( event.originalEvent ) {
			for ( var i = $.event.props.length, prop; i; ) {
				prop = $.event.props[ --i ];
				event[ prop ] = event.originalEvent[ prop ];
			}
		}
		this.element.trigger( event, data );
		args = $.isArray( data ) ?
			[ event ].concat( data ) :
			[ event, data ];

		return !( $.isFunction( callback ) &&
			callback.apply( this.element[0], args ) === false ||
			event.isDefaultPrevented() );
	}
});

Drcom.Controller("Drcom.Pdf",{
	defaults:
	{
		pageNumber:1,
		pageTotal:0,
		src:"",
		controls:true,
		widthPerPage:628,
		heightPage:1305,
		heightPerPage:1305
		
	}
},{
	init:function()
	{
		this.setPageTotal(this.options.pageTotal);
		this.element[0].onload=this.callback("onload");
		this.element.attr("src",this.options.src);
		
		
	},
	setPageTotal:function(total)
	{
		this.pageTotal=total;
	},
	getPageTotal:function()
	{
		return this.pageTotal;
	},
	onload:function()
	{
		
		//$("body").height(this.options.pageTotal*this.options.heightPerPage);
		this.element.css({
			width:this.options.widthPerPage,
			height:this.options.pageTotal*this.options.heightPerPage
		});
		var pageNumber=this.options.pageNumber;
		var instance=this;
		
		setTimeout(function()
		{
			instance.gotoPage(pageNumber);
			instance.element.show();
		},800);

	},
	gotoPage:function(number)
	{
		number=number-1;
		window.scrollTo(0, this.options.heightPage*number);
	},
	getPageNumber:function()
	{
		var pageNumber=window.scrollY/this.options.heightPage;
		return Math.round(pageNumber)+1;
	}
});
Drcom.Controller("Drcom.PdfControl",
{
	defaults:
	{
		gotoPage:false,
		previewList:true,
		object:null,
		pageNumber:1,
		onAfterGotoPage:function(){},
		changePageNumber:function(){},
		autoHide:false,
		gotoSlide:function(){}
	}
},
{
	init:function()
	{

		this.object=this.options.object;
		this.createControls();
	},
	createControls:function()
	{
		this.controls=[];
		Drcom.PdfControl.plugin.call(this,"add");
		this.mask=$(".mask_pdf",this.element);
		var toolbar=$("<div class='toolbar_pdf'></div>");
		toolbar.append($("<div class='item_pdf item_gotoslide'></div>"));
		toolbar.append($("<div class='item_pdf item_gototop'></div>"));

		for(var name in this.controls)
		{
			var el=this.controls[name];
			this.element.append(el);
			toolbar.append($("<div class='popup_pdf item_pdf item_"+name+"'></div>").attr("rel","#"+name));
		}
		
		this.element.append(toolbar);
	},
	lockScroll:function()
	{
		this.mask.show();
	},
	unlockScroll:function()
	{
		this.mask.hide();
		
	},
	".toolbar_pdf .item_gotoslide click":function()
	{
		this.options.gotoSlide();
	},
	".toolbar_pdf .item_gototop click":function(el,ev)
	{
		$(".toolbar .item_pdf",this.element).not(el).each(function(){
			var dialog=$($(this).attr("rel"));
			dialog.hide();
		});
		$(".toolbar .item_pdf",this.element).removeClass("current");	
		this.unlockScroll();
		window.scrollTo(0, 0);
		this.element.css({
			top:scrollY
		});
	},
	".toolbar_pdf .popup_pdf click":function(el,ev)
	{
		$(".toolbar_pdf .item_pdf",this.element).not(el).each(function(){
			var dialog=$($(this).attr("rel"));
			dialog.hide();
		});
		$(".toolbar_pdf .item_pdf",this.element).removeClass("current");
		
		
		var current=$(el.attr("rel"),this.element);
		if(current.is(":visible")==true)
		{
			current.hide();
			this.unlockScroll();
		}
		else
		{
			el.addClass("current");
			current.show();
			this.lockScroll();
			this._trigger("toogle",null,[current,current.is(":visible")]);					
		}

	},
	createDialog:function(id,el)
	{
		return $("<div class='dialog_pdf'><div class='close'></div></div>").attr("id",id).append(el);
	},
	gotoPage:function(number)
	{
		if(this.options.autoHide==true)
		{
			$(".toolbar .item_pdf",this.element).removeClass("current");
			$(".dialog_pdf",this.element).hide();
			this.unlockScroll();		
		}
		var scrollY= this.object.options.heightPage*(number-1);
		this.scroll(scrollY,number);
		this.object.gotoPage(number);
		this._trigger("onAfterGotoPage",null,[number]);
	},
	getPageTotal:function()
	{
		return this.object.getPageTotal();
	},
	getPageNumber:function()
	{
		return this.object.getPageNumber();
	},
	_trigger:function(eventName,event,data)
	{
		this.Class.plugin.call(this,eventName,data);
		this._super.apply(this,arguments);
	},
	"{window} scroll":function(el,ev)
	{
		this.scroll(window.scrollY);
	},
	scroll:function(scrollY,pageNumber)
	{
		if(pageNumber==null)
			var pageNumber=this.getPageNumber();
		this._trigger("changePageNumber",null,[pageNumber]);
		this.element.css({
			top:scrollY
		});
	}
});
//gotoPage
Drcom.PdfControl.plugin.add(Drcom.PdfControl,"gotoPage",{
	add:function()
	{
		var dialog=this.createDialog("gotoPage","<label for='gotoPage_pageNumber'>Page:</label><input type='number'  id='gotoPage_pageNumber' />of "+this.getPageTotal()+" <input type='button' value='Go to page' id='gotoPage_submit'  />");
		this.controls["gotoPage"]=dialog;
		var instance=this;
		function gotoPage()
		{
			
			var pageNumber=$("#gotoPage_pageNumber",dialog).val();
			if(pageNumber>instance.getPageTotal() || pageNumber<1)
			{
				$("#mesaagebox_pagenotexist_pdf .title_pdf").html("There is no page number '"+pageNumber+"' in this document.");
				$("#mesaagebox_pagenotexist_pdf").show();
				$("#gotoPage_pageNumber",dialog).blur();
				$(".button_okpdf").unbind("click").bind("click",function(){
					$("#mesaagebox_pagenotexist_pdf").hide();
					
				})
				return;
			}
			instance.gotoPage(pageNumber);
			//hide keyboard
			if(instance.options.autoHide==true)
			{
				$("#gotoPage_pageNumber",dialog).blur();
			}
				
		}
		
		this.bind($("#gotoPage_pageNumber",dialog),"keypress",function(e){
			 if( e.which<48 || e.which>57)
			    return false;
		});
		this.bind($("#gotoPage_pageNumber",dialog),"keydown",function(ev){

			if(ev.keyCode==13)
			{
				gotoPage();
			}
		});
		//handle
		$("#gotoPage_submit",dialog).bind("click",function(ev){
			gotoPage();
			return false;
		});
		

	},
	changePageNumber:function(number)
	{
		$("#gotoPage_pageNumber").val(number);
	}
});

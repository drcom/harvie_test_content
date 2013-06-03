$(function($)
{
	var _super=Drcom.controls.scroll;
	function picker(el, options)
	{
		if(options==null)
			options={};
		this.init(el, options);
		
	}
	picker.prototype =
	{
		init : function(el, options)
		{
			this.element=el;
			var opts=$.extend(
			{
				hScrollbar:false,
				vScrollbar:false,
				onScrollEnd:function(){this._onAnimationEnd();},
				onChange:function(ui){},
				value:0,
				name:null,
				duration:500,
				checkDOMChanges : false,
				displayRows:3,
				bounce:false,
				useTransform:false
			}, options);
			$.extend(options,opts);
			_super.prototype.init.apply(this, [el, options]);
			if(this.options.name==null)
				this.options.name=this.element.attr("name");
			this.defaultValue = this.options.value;
			this.value=-1;
			this.newvalue=-1;
			this.lock=false;
			
			this.items=this.getItems();
			this.height=$(this.items[0]).height();
			$(this.scroller).height($(this.scroller).height());
			var list=[];
			//remove Element
			for(var i=0;i<this.items.length;i++)
			{
				var text=$(this.items[i]).html();
				var value=$(this.items[i]).attr("value");
				list.push({
					text:text,
					value:value
				});
			}
			//this.items.remove();
			this.items=list;
			//end:remove
			
			$("<input type='hidden' name='" + this.options.name + "' value='"+this.val()+"' />").appendTo(el);

			this.val(options.value,0);
			this._bindEvents();
		},
		_bindEvents:function()
		{
			var instance=this;
			$("input",this.elemnet).bind("refresh",function(ev)
			{
            	var args = Array.prototype.slice.call(arguments, 1);
                args.unshift($(this), ev);
                instance.callback('input refresh')(args);
			});
			$("input",this.elemnet).bind("restoreState",function(ev)
			{
            	var args = Array.prototype.slice.call(arguments, 1);
                args.unshift($(this), ev);
                instance.callback('input restoreState').apply(this,args);
			});
		},
		callback:function(name)
		{
			var instance=this;
			return function()
			{
				return instance[name].apply(instance,arguments);
			};
		},
		_onAnimationEnd:function()
		{
			
			var top=this.height*(Math.floor(this.options.displayRows/2));
			var scroller=$(this.scroller);
			var index=Math.round( (Math.abs(this.y-top)*this.items.length)/scroller.height());
			var items=this.getItems();
			//add active
			var item=$(items[index]);
			var value=item.attr("value");
			this.value=value;


			items.removeClass("active");
			$("[value='"+this.value+"']",this.element).addClass("active");
			
			
			if( this.lock==false)
			{
				this.lock=true;
				this.scrollTo(0,this._getPosition(items,value)+top,500);
			}
			else
			{
			
				var html=this._renderHTML(this.value);
				var tagUL=$(html).css({left:0,top:0,position:"absolute",visibility:"hidden"});
				var items=tagUL.children();
				$(this.scroller).append(tagUL);
				var y=this._getPosition(items,value)+top;
				this._pos(0,y);
				tagUL.css({
					visibility:"visible"
				});
				$("ul:first",this.scroller).remove();
				$("[value='"+this.value+"']",this.element).addClass("active");

				
				

			}
			
		},
		getItems:function()
		{
			return $($(this.scroller).children()[0]).children();
		},
		_renderHTML:function(number)
		{

			
			var html="";
			function append(name,value)
			{
				html=html+drcom.u.template("<li value='<%=value%>'><%=name%></li>")({
					name:name<10?"0"+name:name,
					value:name
				});
			}
			var increase=Math.round(this.items.length/2);
			var to=number-increase;
			
			if(to<0)
			{
				for(var i=this.items.length-Math.abs(to)+1;i<this.items.length;i++)
				{
					append(i);
				}
				for(var i=0;i<number;i++)
				{
					append(i);
				}
			}
			else
			{
				for(var i=to;i<number;i++)
				{
					append(i);
				}			
			}
		
			var to=number+increase;

			for(var i=number;i<to;i++)
			{
				if(i>=this.items.length)
				{
					i=0;
					to=to-this.items.length-1;
				}
				append(i);

			}
			return "<ul>"+html+"</ul>";
		},
		_setValue:function(value,duration)
		{
			var y=this._getPosition(this.getItems(),value);
			this.scrollTo(this.x,y,duration);
		},
		_getPosition:function(items,value)
		{
			function getIndex(value)
			{
				for(var i=0;i<items.length;i++)
				{
					var val=$(items[i]).attr("value");
					if(val==value)
					{
						this.value=value;
						return i;
						break;
					}
						
				}
				return -1;
				
			}
			var index=getIndex.apply(this,[value]);
			var y=index*this.height;
			return -y;
		},
		val:function(value,duration)
		{
			if(arguments.length==1)
				duration=500;
			if(value!=null)
			{
				this._setValue(value,duration);
			}
			else
				return this.value;
		},
		_end : function(event)
		{
			this.lock=false;
			_super.prototype._end.apply(this, arguments);
		},
        "input refresh" : function(el,ev)
        {

            this.val(this.defaultValue);
        },
		"input restoreState":function(el,ev,data)
        {
            var name = $("input",this.element).attr("name");
            if(data[name] != null)
                this.val(data[name]);
        }
	};
	picker.prototype = $.extend(false, _super.prototype, picker.prototype);
	drcom.utils.fn("drcom_controls_picker",picker);
	if(Drcom.controls==null)
		Drcom.controls={};
	Drcom.controls.picker = picker;
});

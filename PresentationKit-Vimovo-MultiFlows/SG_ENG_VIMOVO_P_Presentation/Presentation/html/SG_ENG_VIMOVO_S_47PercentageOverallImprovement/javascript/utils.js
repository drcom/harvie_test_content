drcom.utils.fn=function(name,namespace)
{
	
	$.fn[name] = function(method)
	{
		for(var i=0;i<$(this).length;i++)
		{
			var element=$(this[i]);
			var object = element.data(name);
			if(object == null)
			{
				element.data(name, new namespace(element, method));
			}
			else
			{
				if(arguments.length==0)
				{
					return object;
				}
				if(object[method]!=null)
				{
					return object[method](Array.prototype.slice.call(arguments, 1));
				}
				else
				{
					$.error('Method ' + method + ' does not exist on jQuery.'+name);
				}

			}
		}


	};	
}


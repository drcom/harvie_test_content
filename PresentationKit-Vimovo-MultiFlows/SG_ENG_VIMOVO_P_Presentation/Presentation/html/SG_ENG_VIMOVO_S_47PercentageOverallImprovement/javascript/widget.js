$(function ($)
{
    var _createWidget=$.Widget.prototype._createWidget;
    $.extend($.Widget.prototype,
        {
            options:{},
            listensTo:[],
            events:[],
            _createWidget: function()
            {
                _createWidget.apply(this,arguments);
                this.init();

                this.element.addClass(this.widgetName);
                this.element.data("controller", this);
                var instance = this;
                //listens
                $(this.listensTo).each(function (i, nameEvent)
                {
                    instance.bind(instance.element, nameEvent, function (ev)
                    {
                    	var args = Array.prototype.slice.call(arguments, 1);
                        args.unshift($(this), ev);
                    	instance[nameEvent].apply(instance, args);
                    });
                    
                });
                //autoBinds
                function getSelector(selector)
                {
                    if (selector.indexOf("{") != -1)
                        {
                            var name = selector.substr(1, selector.length - 2);
                            selector = this.options[name];
                        }
                        if (selector == "window" || selector == "document")
                            return eval(selector);
                        if (selector == "body")
                            return $(selector);
                        return selector;
                }
                function delegate(selector, eventName, func)
                {
                    var instance = this;
                    if (typeof func == "string")
                    {
                        this.element.delegate(selector, eventName, function (ev)
                        {
                            var el = $(this);
                            var args = Array.prototype.slice.call(arguments, 1);
                            args.unshift(el, ev);
                            instance[func].apply(instance, args);

                        });
                    }
                    else
                    {
                        this.element.delegate(selector, eventName, func);
                    }
                }
                var processors = [];
                $.each("change click contextmenu dblclick keydown keyup keypress mousedown mousemove mouseout mouseover mouseup reset resize scroll select submit focusin focusout mouseenter mouseleave".split(" "), function (i, v)
                {
                    processors.push(v);
                });
                $.each($.event.special,function(name,func)
                {
                    processors.push(name);
                })
                processors=processors.concat(this.events);
                $(processors).each(function (i, funcName)
                {
                    if (instance[funcName] != null && $.isFunction(instance[funcName]) == true)
                    {
                        instance.bind(instance.element, funcName, function (ev)
                        {
                            var args=Array.prototype.slice.call(arguments,1);
                            args.unshift($(this),ev);
                            instance[funcName].apply(instance, args);
                        });
                    }
                });
                for (var funcName in this)
                {
                    if (funcName == 'constructor' || !$.isFunction(this[funcName]) || /[^\w]/.test(funcName) == false)
                    {
                        continue;
                    }
                    var pattern = funcName.split(" ");
                    var selector = getSelector.apply(this, [pattern[0]]);
                    var nameEvent = pattern[1];
                    if (nameEvent.indexOf("{") != -1)
                        {
                            var name = selector.substr(1, nameEvent.length - 2);
                            selector = this.options[name];
                        }
                        if (selector == "window" || selector == "document")
                            selector = eval(selector);
                        if (selector == "body")
                            selector = $(selector);
                        if (typeof (selector) == "object")
                        {
                            this.bind(selector, nameEvent, funcName);
                        }
                        else
                        {
                            delegate.apply(this,[selector, nameEvent, funcName]);
                        }
                }
            },
            init: function(){},
            //call super
            _super: function (method)
            {
                var obj = this.__proto__;
                for (var i = 0; i < 10; i++)
                {
                    if (obj[method].toString()== this[method].toString())
                    {
                        if (obj.__proto__[method] != null)
                        {
                            if (obj.__proto__[method].toString() != this[method].toString())
                                return obj.__proto__[method].call(this, Array.prototype.slice.call(arguments, 1));
                        }
                    }
                    obj = obj.__proto__;
                }
                return $.Widget.prototype[method].call(this, Array.prototype.slice.call(arguments, 1));
            },
            //good
            callback: function (name)
            {
                var instance = this;
                return callback = function ()
                {
                    instance[name].apply(instance, arguments);
                }
            },
            //return el,ev,arguments
            bind: function (el, eventName, func)
            {
                var instance = this;
                if (typeof el == "string")
                {
                    func=eventName;
                    eventName=el;
                    el=this.element;
                }
                var handlers = {};
                handlers[eventName] = function ()
                {
                    func.apply($(el)[0], arguments);
                };
                instance._bind(el, handlers);
            }
        });
});

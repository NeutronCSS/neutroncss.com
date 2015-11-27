// Custom event tracking
// =====================

// Download button
var downloadLinks = document.querySelectorAll('[data-anal-downloaded]');

function addDownloadToDatalayer() {
	var downloadType = this.getAttribute('data-anal-downloaded');
	
	dataLayer.push({
		'event': 'downloaded-neutron',
		'downloaded-neutron-type': downloadType
	});
}

for (var i = 0; i < downloadLinks.length; ++i) {
	var link = downloadLinks[i];

	link.addEventListener('click', addDownloadToDatalayer, false);
}	

var neutron = neutron || {};

neutron.column = (function () {
	'use strict';
	
	var column = {};
	column.target = "span";
	column.container = "#flexibility";
	column.input = {};
	column.valueDefault = "";
	column.value = "";
	
	column.init = function() {
		column.input = document.querySelector("#column-input");
		column.valueDefault = column.input.getAttribute("data-default");
		column.value = column.valueDefault;
		
		column.input.addEventListener('keyup', changeColumn, false);
	}
	
	var changeColumn = function() {

		setTimeout(function () {
			var val = column.input.value.trim();
			if(val === 0 || val === "") {
				column.value = column.valueDefault;
			} else {
				column.value = column.input.value
			}
			
			applyWidths();
		}, 500);

	}
	
	var applyWidths = function() {
		var columns = getColumns();
		
		// Original margin values
		var setMargin = {
			left: 0,
			right: 0
		}
		
		// Get original margin values
		for (var i = 0; i < columns.length; ++i) {
			var col = columns[i];
			
			col.removeAttribute("style");
			
			var marginLeft = parseFloat(window.getComputedStyle(col).getPropertyValue("margin-left"));
			var marginRight = parseFloat(window.getComputedStyle(col).getPropertyValue("margin-right"));

			if(marginLeft != 0) {
				console.log('margin left', marginLeft);
				setMargin.left = marginLeft;
			}
			
			if(marginRight != 0) {
				setMargin.right = marginRight;
			}
		}
		
		console.log('calculated margins: ', setMargin);

		for (var i = 0; i < columns.length; ++i) {

			var col = columns[i];
			
			// Remove any currently set styles
			col.removeAttribute("style");
			
			// Calc initial percentage column should take up					
			var widthPercentage = (100 / column.value) + "%";
			
			// Get amount to compensate for flush margins		
			var flushLeft = setMargin.left / column.value;
			var flushRight = setMargin.right / column.value;
			
			// Take initial percentage and modify it by the margins and flush compensation
			var calcedWidth = widthPercentage + " - " + setMargin.left + "px - " + setMargin.right + "px + " + flushLeft + "px + " + flushRight + "px";
			
			//set width
			col.style.width = "calc(" + calcedWidth + ")";
			
			// Reset styles from original CSS declaration
			col.style.clear = "none";
			col.style.marginLeft = setMargin.left + 'px';
			col.style.marginRight = setMargin.right + 'px';
		}	
		
		// target only the first and last columns for their specific styles
		var newLeftMarginCols = document.querySelectorAll(column.container + " > " + column.target + ":nth-of-type(" + column.value + "n+1)");
		var newRightMarginCols = document.querySelectorAll(column.container + " > " + column.target + ":nth-of-type(" + column.value + "n+" + column.value + ")");
		
		// first column on a row
		for (var i = 0; i < newLeftMarginCols.length; ++i) {
			var col = newLeftMarginCols[i];
			col.style.marginLeft = 0;
			col.style.clear = "left";
		}
		
		// Last column on a row
		for (var i = 0; i < newRightMarginCols.length; ++i) {
			var col = newRightMarginCols[i];
			col.style.marginRight = 0;
		}		
	}
	
	var getColumns = function() {
		var columns = document.querySelectorAll(column.container + " > " + column.target);

		return columns;
	}

	return column;
	
})();

/**
 * Collapsible, jQuery Plugin
 * 
 * Collapsible management.  Optional cookie support using the jQuery Cookie plugin:
 * https://github.com/carhartl/jquery-cookie
 * 
 * Copyright (c) 2010 John Snyder (snyderplace.com)
 * @license http://www.snyderplace.com/collapsible/license.txt New BSD
 * @version 1.2.1
 */
(function($) {
    $.fn.collapsible = function (cmd, arg) {

        //firewalling
        if (!this || this.length < 1) {
            return this;
        }

        //address command requests
        if (typeof cmd == 'string') {
            return $.fn.collapsible.dispatcher[cmd](this, arg);
        }
        
        //return the command dispatcher
        return $.fn.collapsible.dispatcher['_create'](this, cmd);
    };

    //create the command dispatcher
    $.fn.collapsible.dispatcher = {

        //initialized with options
        _create : function(obj, arg) {
            createCollapsible(obj, arg);
        },

        //toggle the element's display
        toggle: function(obj) {
            toggle(obj, loadOpts(obj));
            return obj;
        },

        //show the element
        open: function(obj) {
            open(obj, loadOpts(obj));
            return obj;
        },

        //hide the element
        close: function(obj) {
            close(obj, loadOpts(obj));
            return obj;
        },

        //check if the element is closed
        collapsed: function(obj) {
            return collapsed(obj, loadOpts(obj));
        },

        //open all closed containers
        openAll: function(obj) {
            return openAll(obj, loadOpts(obj));
        },

        //close all opened containers
        closeAll: function(obj) {
            return closeAll(obj, loadOpts(obj));
        }
    };

    //create the initial collapsible
    function createCollapsible(obj, options)
    {

        //build main options before element iteration
        var opts = $.extend({}, $.fn.collapsible.defaults, options);
        
        //store any opened default values to set cookie later
        var opened = [];
        
        //iterate each matched object, bind, and open/close
        obj.each(function() {

            var $this = $(this);
            saveOpts($this, opts);
            
            //bind it to the event
            if (opts.bind == 'mouseenter') {

                $this.bind('mouseenter', function(e) {
                    //e.preventDefault(); 
                    toggle($this, opts);
                });
            }
            
            //bind it to the event
            if (opts.bind == 'mouseover') {

                $this.bind('mouseover',function(e) {
                    //e.preventDefault(); 
                    toggle($this, opts); 
                });
            }
            
            //bind it to the event
            if (opts.bind == 'click') {

                $this.bind('click', function(e) {
                    //e.preventDefault();
                    toggle($this, opts);
                });

            }
            
            //bind it to the event
            if (opts.bind == 'dblclick') {

                $this.bind('dblclick', function(e) {

                    //e.preventDefault();
                    toggle($this, opts);
                });

            }
            
            //initialize the collapsibles
            //get the id for this element
            var id = $this.attr('id');
            
            //if not using cookies, open defaults
            if (!useCookies(opts)) {

                //is this collapsible in the default open array?
                var dOpenIndex = inDefaultOpen(id, opts);
                
                //close it if not defaulted to open
                if (dOpenIndex === false) {

                    $this.addClass(opts.cssClose);
                    opts.loadClose($this, opts);

                } else { //its a default open, open it

                    $this.addClass(opts.cssOpen);
                    opts.loadOpen($this, opts);
                    opened.push(id);
                }

            } else { //can use cookies, use them now

                //has a cookie been set, this overrides default open
                if (issetCookie(opts)) {

                    var cookieIndex = inCookie(id, opts);

                    if (cookieIndex === false) {

                        $this.addClass(opts.cssClose);
                        opts.loadClose($this, opts);

                    } else {

                        $this.addClass(opts.cssOpen);
                        opts.loadOpen($this, opts);
                        opened.push(id);
                    }

                } else { //a cookie hasn't been set open defaults, add them to opened array

                    dOpenIndex = inDefaultOpen(id, opts);

                    if (dOpenIndex === false) {

                        $this.addClass(opts.cssClose);
                        opts.loadClose($this, opts);

                    } else {

                        $this.addClass(opts.cssOpen);
                        opts.loadOpen($this, opts);
                        opened.push(id);
                    }
                }
            }
        });
        
        //now that the loop is done, set the cookie
        if (opened.length > 0 && useCookies(opts)) {

            setCookie(opened.toString(), opts);

        } else { //there are none open, set cookie

            setCookie('', opts);
        }
        
        return obj;
    }
    
    //load opts from object
    function loadOpts($this) {
        return $this.data('collapsible-opts');
    }
    
    //save opts into object
    function saveOpts($this, opts) {
        return $this.data('collapsible-opts', opts);
    }
    
    //returns true if object is opened
    function collapsed($this, opts) {
        return $this.hasClass(opts.cssClose);
    }
    
    //hides a collapsible
    function close($this, opts) {

        //give the proper class to the linked element
        $this.addClass(opts.cssClose).removeClass(opts.cssOpen);
        
        //close the element
        opts.animateClose($this, opts);
        
        //do cookies if plugin available
        if (useCookies(opts)) {
            // split the cookieOpen string by ","
            var id = $this.attr('id');
            unsetCookieId(id, opts);
        }
    }
    
    //opens a collapsible
    function open($this, opts) {

        //give the proper class to the linked element
        $this.removeClass(opts.cssClose).addClass(opts.cssOpen);
        
        //open the element
        opts.animateOpen($this, opts);
        
        //do cookies if plugin available
        if (useCookies(opts)) {

            // split the cookieOpen string by ","
            var id = $this.attr('id');
            appendCookie(id, opts);
        }
    }
    
    //toggle a collapsible on an event
    function toggle($this, opts) {

        if (collapsed($this, opts)) {

            //open a closed element
            open($this, opts);

        } else {

            //close an open element
            close($this, opts);
        }
        
        return false;
    }

    //open all closed containers
    function openAll($this, opts) {

        // loop through all container elements
        $.each($this, function(elem, value) {

            if (collapsed($(value), opts)) {

                //open a closed element
                open($(value), opts);
            }
        });
    }

    //close all open containers
    function closeAll($this, opts) {

        $.each($this, function(elem, value) {

            if (!collapsed($(value), opts)) {

                //close an opened element
                close($(value), opts);
            }
        });
    }
    
    //use cookies?
    function useCookies(opts) {

        //return false if cookie plugin not present or if a cookie name is not provided
        if (!$.cookie || opts.cookieName == '') {
            return false;
        }
        
        //we can use cookies
        return true;
    }
    
    //append a collapsible to the cookie
    function appendCookie(value, opts) {

        //check if cookie plugin available and cookiename is set
        if (!useCookies(opts)) {
            return false;
        }
        
        //does a cookie already exist
        if (!issetCookie(opts)) {

            //no lets set one
            setCookie(value, opts);
            return true;
        }
        
        //cookie already exists, is this collapsible already set?
        if (inCookie(value, opts)) { //yes, quit here
            return true;
        }
        
        //get the cookie
        var cookie = decodeURIComponent($.cookie(opts.cookieName));

        //turn it into an array
        var cookieArray = cookie.split(',');
        
        //add it to list
        cookieArray.push(value);
        
        //save it
        setCookie(cookieArray.toString(), opts);
        
        return true;    
    }
    
    //unset a collapsible from the cookie
    function unsetCookieId(value, opts)
    {
        //check if cookie plugin available and cookiename is set
        if (!useCookies(opts)) {
            return false;
        }
        
        //if its not there we don't need to remove from it
        if (!issetCookie(opts)) { //quit here, don't have a cookie 
            return true;
        }
        
        //we have a cookie, is this collapsible in it
        var cookieIndex = inCookie(value, opts);
        if (cookieIndex === false) { //not in the cookie quit here
            return true;
        }
        
        //still here get the cookie
        var cookie = decodeURIComponent($.cookie(opts.cookieName));
        
        //turn it into an array
        var cookieArray = cookie.split(',');
        
        //lets pop it out of the array
        cookieArray.splice(cookieIndex, 1);

        //overwrite
        setCookie(cookieArray.toString(), opts);

        return true
    }
    
    //set a cookie
    function setCookie(value, opts)
    {
        //can use the cookie plugin
        if (!useCookies(opts)) { //no, quit here
            return false;
        }
        
        //cookie plugin is available, lets set the cookie
        $.cookie(opts.cookieName, value, opts.cookieOptions);

        return true;
    }
    
    //check if a collapsible is in the cookie
    function inCookie(value, opts)
    {
        //can use the cookie plugin
        if (!useCookies(opts)) {
            return false;
        }
        
        //if its not there we don't need to remove from it
        if (!issetCookie(opts)) { //quit here, don't have a cookie 
            return false;
        }

        //get the cookie value
        var cookie = decodeURIComponent($.cookie(opts.cookieName));
        
        //turn it into an array
        var cookieArray = cookie.split(',');
        
        //get the index of the collapsible if in the cookie array
        var cookieIndex = $.inArray(value, cookieArray);
        
        //is this value in the cookie array
        if (cookieIndex == -1) { //no, quit here
            return false;
        }
        
        return cookieIndex;
    }
    
    //check if a cookie is set
    function issetCookie(opts)
    {
        //can we use the cookie plugin
        if (!useCookies(opts)) { //no, quit here
            return false;
        }
        
        //is the cookie set
        if ($.cookie(opts.cookieName) === null) { //no, quit here
            return false;
        }
        
        return true;
    }
    
    //check if a collapsible is in the list of collapsibles to be opened by default
    function inDefaultOpen(id, opts)
    {
        //get the array of open collapsibles
        var defaultOpen = getDefaultOpen(opts);
        
        //is it in the default open array
        var index = $.inArray(id, defaultOpen);
        if (index == -1) { //nope, quit here
            return false;
        }
        
        return index;
    }
    
    //get the default open collapsibles and return array
    function getDefaultOpen(opts)
    {
        //initialize an empty array
        var defaultOpen = [];
        
        //if there is a list, lets split it into an array
        if (opts.defaultOpen != '') {
            defaultOpen = opts.defaultOpen.split(',');
        }
        
        return defaultOpen;
    }
    
    // settings
    $.fn.collapsible.defaults = {
        cssClose: 'collapse-close', //class you want to assign to a closed collapsible header
        cssOpen: 'collapse-open', //class you want to assign an opened collapsible header
        cookieName: 'collapsible', //name of the cookie you want to set for this collapsible
        cookieOptions: { //cookie options, see cookie plugin for details
            path: '/',
            expires: 7,
            domain: '',
            secure: ''
        },
        defaultOpen: '', //comma separated list of header ids that you want opened by default
        speed: 'slow', //speed of the slide effect
        bind: 'click', //event to bind to, supports click, dblclick, mouseover and mouseenter
        animateOpen: function (elem, opts) { //replace the standard slideUp with custom function
            elem.next().stop(true, true).slideDown(opts.speed);
        },
        animateClose: function (elem, opts) { //replace the standard slideDown with custom function
            elem.next().stop(true, true).slideUp(opts.speed);
        },
        loadOpen: function (elem, opts) { //replace the default open state with custom function
            elem.next().show();
        },
        loadClose: function (elem, opts) { //replace the default close state with custom function
            elem.next().hide();
        }
    };

})(jQuery);
/* http://prismjs.com/download.html?themes=prism&languages=markup+css+clike+javascript+scss&plugins=remove-initial-line-feed */
var _self="undefined"!=typeof window?window:"undefined"!=typeof WorkerGlobalScope&&self instanceof WorkerGlobalScope?self:{},Prism=function(){var e=/\blang(?:uage)?-(?!\*)(\w+)\b/i,t=_self.Prism={util:{encode:function(e){return e instanceof n?new n(e.type,t.util.encode(e.content),e.alias):"Array"===t.util.type(e)?e.map(t.util.encode):e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/\u00a0/g," ")},type:function(e){return Object.prototype.toString.call(e).match(/\[object (\w+)\]/)[1]},clone:function(e){var n=t.util.type(e);switch(n){case"Object":var a={};for(var r in e)e.hasOwnProperty(r)&&(a[r]=t.util.clone(e[r]));return a;case"Array":return e.map&&e.map(function(e){return t.util.clone(e)})}return e}},languages:{extend:function(e,n){var a=t.util.clone(t.languages[e]);for(var r in n)a[r]=n[r];return a},insertBefore:function(e,n,a,r){r=r||t.languages;var l=r[e];if(2==arguments.length){a=arguments[1];for(var i in a)a.hasOwnProperty(i)&&(l[i]=a[i]);return l}var o={};for(var s in l)if(l.hasOwnProperty(s)){if(s==n)for(var i in a)a.hasOwnProperty(i)&&(o[i]=a[i]);o[s]=l[s]}return t.languages.DFS(t.languages,function(t,n){n===r[e]&&t!=e&&(this[t]=o)}),r[e]=o},DFS:function(e,n,a){for(var r in e)e.hasOwnProperty(r)&&(n.call(e,r,e[r],a||r),"Object"===t.util.type(e[r])?t.languages.DFS(e[r],n):"Array"===t.util.type(e[r])&&t.languages.DFS(e[r],n,r))}},plugins:{},highlightAll:function(e,n){for(var a,r=document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'),l=0;a=r[l++];)t.highlightElement(a,e===!0,n)},highlightElement:function(n,a,r){for(var l,i,o=n;o&&!e.test(o.className);)o=o.parentNode;o&&(l=(o.className.match(e)||[,""])[1],i=t.languages[l]),n.className=n.className.replace(e,"").replace(/\s+/g," ")+" language-"+l,o=n.parentNode,/pre/i.test(o.nodeName)&&(o.className=o.className.replace(e,"").replace(/\s+/g," ")+" language-"+l);var s=n.textContent,u={element:n,language:l,grammar:i,code:s};if(!s||!i)return t.hooks.run("complete",u),void 0;if(t.hooks.run("before-highlight",u),a&&_self.Worker){var g=new Worker(t.filename);g.onmessage=function(e){u.highlightedCode=e.data,t.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,r&&r.call(u.element),t.hooks.run("after-highlight",u),t.hooks.run("complete",u)},g.postMessage(JSON.stringify({language:u.language,code:u.code,immediateClose:!0}))}else u.highlightedCode=t.highlight(u.code,u.grammar,u.language),t.hooks.run("before-insert",u),u.element.innerHTML=u.highlightedCode,r&&r.call(n),t.hooks.run("after-highlight",u),t.hooks.run("complete",u)},highlight:function(e,a,r){var l=t.tokenize(e,a);return n.stringify(t.util.encode(l),r)},tokenize:function(e,n){var a=t.Token,r=[e],l=n.rest;if(l){for(var i in l)n[i]=l[i];delete n.rest}e:for(var i in n)if(n.hasOwnProperty(i)&&n[i]){var o=n[i];o="Array"===t.util.type(o)?o:[o];for(var s=0;s<o.length;++s){var u=o[s],g=u.inside,c=!!u.lookbehind,f=0,h=u.alias;u=u.pattern||u;for(var p=0;p<r.length;p++){var d=r[p];if(r.length>e.length)break e;if(!(d instanceof a)){u.lastIndex=0;var m=u.exec(d);if(m){c&&(f=m[1].length);var y=m.index-1+f,m=m[0].slice(f),v=m.length,k=y+v,b=d.slice(0,y+1),w=d.slice(k+1),P=[p,1];b&&P.push(b);var A=new a(i,g?t.tokenize(m,g):m,h);P.push(A),w&&P.push(w),Array.prototype.splice.apply(r,P)}}}}}return r},hooks:{all:{},add:function(e,n){var a=t.hooks.all;a[e]=a[e]||[],a[e].push(n)},run:function(e,n){var a=t.hooks.all[e];if(a&&a.length)for(var r,l=0;r=a[l++];)r(n)}}},n=t.Token=function(e,t,n){this.type=e,this.content=t,this.alias=n};if(n.stringify=function(e,a,r){if("string"==typeof e)return e;if("Array"===t.util.type(e))return e.map(function(t){return n.stringify(t,a,e)}).join("");var l={type:e.type,content:n.stringify(e.content,a,r),tag:"span",classes:["token",e.type],attributes:{},language:a,parent:r};if("comment"==l.type&&(l.attributes.spellcheck="true"),e.alias){var i="Array"===t.util.type(e.alias)?e.alias:[e.alias];Array.prototype.push.apply(l.classes,i)}t.hooks.run("wrap",l);var o="";for(var s in l.attributes)o+=(o?" ":"")+s+'="'+(l.attributes[s]||"")+'"';return"<"+l.tag+' class="'+l.classes.join(" ")+'" '+o+">"+l.content+"</"+l.tag+">"},!_self.document)return _self.addEventListener?(_self.addEventListener("message",function(e){var n=JSON.parse(e.data),a=n.language,r=n.code,l=n.immediateClose;_self.postMessage(t.highlight(r,t.languages[a],a)),l&&_self.close()},!1),_self.Prism):_self.Prism;var a=document.getElementsByTagName("script");return a=a[a.length-1],a&&(t.filename=a.src,document.addEventListener&&!a.hasAttribute("data-manual")&&document.addEventListener("DOMContentLoaded",t.highlightAll)),_self.Prism}();"undefined"!=typeof module&&module.exports&&(module.exports=Prism),"undefined"!=typeof global&&(global.Prism=Prism);
Prism.languages.markup={comment:/<!--[\w\W]*?-->/,prolog:/<\?[\w\W]+?\?>/,doctype:/<!DOCTYPE[\w\W]+?>/,cdata:/<!\[CDATA\[[\w\W]*?]]>/i,tag:{pattern:/<\/?[^\s>\/=.]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,inside:{tag:{pattern:/^<\/?[^\s>\/]+/i,inside:{punctuation:/^<\/?/,namespace:/^[^\s>\/:]+:/}},"attr-value":{pattern:/=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,inside:{punctuation:/[=>"']/}},punctuation:/\/?>/,"attr-name":{pattern:/[^\s>\/]+/,inside:{namespace:/^[^\s>\/:]+:/}}}},entity:/&#?[\da-z]{1,8};/i},Prism.hooks.add("wrap",function(a){"entity"===a.type&&(a.attributes.title=a.content.replace(/&amp;/,"&"))}),Prism.languages.xml=Prism.languages.markup,Prism.languages.html=Prism.languages.markup,Prism.languages.mathml=Prism.languages.markup,Prism.languages.svg=Prism.languages.markup;
Prism.languages.css={comment:/\/\*[\w\W]*?\*\//,atrule:{pattern:/@[\w-]+?.*?(;|(?=\s*\{))/i,inside:{rule:/@[\w-]+/}},url:/url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,selector:/[^\{\}\s][^\{\};]*?(?=\s*\{)/,string:/("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,property:/(\b|\B)[\w-]+(?=\s*:)/i,important:/\B!important\b/i,"function":/[-a-z0-9]+(?=\()/i,punctuation:/[(){};:]/},Prism.languages.css.atrule.inside.rest=Prism.util.clone(Prism.languages.css),Prism.languages.markup&&(Prism.languages.insertBefore("markup","tag",{style:{pattern:/<style[\w\W]*?>[\w\W]*?<\/style>/i,inside:{tag:{pattern:/<style[\w\W]*?>|<\/style>/i,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.css},alias:"language-css"}}),Prism.languages.insertBefore("inside","attr-value",{"style-attr":{pattern:/\s*style=("|').*?\1/i,inside:{"attr-name":{pattern:/^\s*style/i,inside:Prism.languages.markup.tag.inside},punctuation:/^\s*=\s*['"]|['"]\s*$/,"attr-value":{pattern:/.+/i,inside:Prism.languages.css}},alias:"language-css"}},Prism.languages.markup.tag));
Prism.languages.clike={comment:[{pattern:/(^|[^\\])\/\*[\w\W]*?\*\//,lookbehind:!0},{pattern:/(^|[^\\:])\/\/.*/,lookbehind:!0}],string:/(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,"class-name":{pattern:/((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,lookbehind:!0,inside:{punctuation:/(\.|\\)/}},keyword:/\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,"boolean":/\b(true|false)\b/,"function":/[a-z0-9_]+(?=\()/i,number:/\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,operator:/--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,punctuation:/[{}[\];(),.:]/};
Prism.languages.javascript=Prism.languages.extend("clike",{keyword:/\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b/,number:/\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,"function":/[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i}),Prism.languages.insertBefore("javascript","keyword",{regex:{pattern:/(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,lookbehind:!0}}),Prism.languages.insertBefore("javascript","class-name",{"template-string":{pattern:/`(?:\\`|\\?[^`])*`/,inside:{interpolation:{pattern:/\$\{[^}]+\}/,inside:{"interpolation-punctuation":{pattern:/^\$\{|\}$/,alias:"punctuation"},rest:Prism.languages.javascript}},string:/[\s\S]+/}}}),Prism.languages.markup&&Prism.languages.insertBefore("markup","tag",{script:{pattern:/<script[\w\W]*?>[\w\W]*?<\/script>/i,inside:{tag:{pattern:/<script[\w\W]*?>|<\/script>/i,inside:Prism.languages.markup.tag.inside},rest:Prism.languages.javascript},alias:"language-javascript"}}),Prism.languages.js=Prism.languages.javascript;
Prism.languages.scss=Prism.languages.extend("css",{comment:{pattern:/(^|[^\\])(?:\/\*[\w\W]*?\*\/|\/\/.*)/,lookbehind:!0},atrule:{pattern:/@[\w-]+(?:\([^()]+\)|[^(])*?(?=\s+[{;])/,inside:{rule:/@[\w-]+/}},url:/(?:[-a-z]+-)*url(?=\()/i,selector:{pattern:/(?=\S)[^@;\{\}\(\)]?([^@;\{\}\(\)]|&|#\{\$[-_\w]+\})+(?=\s*\{(\}|\s|[^\}]+(:|\{)[^\}]+))/m,inside:{placeholder:/%[-_\w]+/}}}),Prism.languages.insertBefore("scss","atrule",{keyword:[/@(?:if|else(?: if)?|for|each|while|import|extend|debug|warn|mixin|include|function|return|content)/i,{pattern:/( +)(?:from|through)(?= )/,lookbehind:!0}]}),Prism.languages.insertBefore("scss","property",{variable:/\$[-_\w]+|#\{\$[-_\w]+\}/}),Prism.languages.insertBefore("scss","function",{placeholder:{pattern:/%[-_\w]+/,alias:"selector"},statement:/\B!(?:default|optional)\b/i,"boolean":/\b(?:true|false)\b/,"null":/\bnull\b/,operator:{pattern:/(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|or|not)(?=\s)/,lookbehind:!0}}),Prism.languages.scss.atrule.inside.rest=Prism.util.clone(Prism.languages.scss);
!function(){"undefined"!=typeof self&&self.Prism&&self.document&&Prism.hooks.add("before-highlight",function(e){if(e.code){var s=e.element.parentNode,n=/\s*\bkeep-initial-line-feed\b\s*/;!s||"pre"!==s.nodeName.toLowerCase()||n.test(s.className)||n.test(e.element.className)||(e.code=e.code.replace(/^(?:\r?\n|\r)/,""))}})}();

var neutron = neutron || {};

neutron.tab = (function () {
	'use strict';

	// locally scoped Object
	var tab = {};
	// tab.group = [];
	
	// return object of tab data
	var getDataStructure = function (elements) {
		var i;
		var data = {};
		
		data.tabs = [];
		data.pages = [];
		data.active = null;
			
		for (i = 0; i < elements.length; ++i) {
			var element = elements[i];


			var attribute = element.getAttribute("data-tabs");
			
			var attributeSplit = attribute.split('.');
			var attributeType = attributeSplit[1];
			var attributeValue = attributeSplit[2];
			
			switch (attributeType) {
				case "tab":
					data.tabs.push(attributeValue);
					break;
				case "page":
					data.pages.push(attributeValue);
					break;
			}
			
			if(typeof attributeSplit[3] !== 'undefined') {
				data.active = attributeSplit[2];
			}

		}
		
		return data;
		
	};
	
	var hideAllExceptActive = function(active, group) {
		console.log('Hide all except: ',active);
		var elements = getElements(group);
		
		var i;
		for (i = 0; i < elements.length; ++i) {
			var element = elements[i];

			var attribute = element.getAttribute("data-tabs");
			
			var attributeType = attribute.split('.')[1];
			var attributeValue = attribute.split('.')[2];
			
			if(attributeType == 'page') {
				if(attributeValue != active) {
					element.style.display = "none";
				} else {
					element.style.display = null
				}
			}
		}
	}
	
	var setOnClickEvents = function(elements) {

		for (var i = 0; i < elements.length; ++i) {
			var element = elements[i];

			var attribute = element.getAttribute("data-tabs");
			var attributeType = attribute.split('.')[1];

			if(attributeType === 'tab') {
				element.addEventListener('click', changeActiveTab, false);
			}
		}	
	}
	
	var removeActiveOnTab = function(group) {
		//var allElements = getElements();
		
		// Filter elements to only one that are active
		var attributeSelector = "[data-tabs$='.active'][data-tabs^='" + group + "']";
		var element = document.querySelector(attributeSelector);
		
		var attr = element.getAttribute("data-tabs");
		attr = attr.substring(0, attr.length - 7);
		
		element.setAttribute("data-tabs", attr);
		
	}
	
	var changeActiveTab = function() {
		var attr = this.getAttribute("data-tabs").split('.');

		var group = attr[0];
		
		// remove any 'active' setting if set
		attr.splice(3, 1);
		
		// get label of active tab
		var activeTab = attr[2];
		
		// create new value for attribute
		var activeAttribute =  attr.join('.') + '.active';
		
		// Deactivate active tab
		removeActiveOnTab(group);
		
		// set clicked tab to be active
		this.setAttribute("data-tabs", activeAttribute);
		
		// After new active tab is set, re-hide elements
		hideAllExceptActive(activeTab, group);
		
	}

	var getElements = function(group) {
				
		var attributeSelector = "[data-tabs^=" + group + "]";
	
		// Get matching tab elements
		return document.querySelectorAll(attributeSelector);

	}
	
	tab.init = function (group, options) {
		// tab.id = tabId;

		// Get matching tab elements
		var elements = getElements(group);

		// Data structure of tabs
		var structure = getDataStructure(elements);

		// Hide all pages except for designated active page
		hideAllExceptActive(structure.active, group);
		
		// Set on click events
		setOnClickEvents(elements);
	
	};
	
	return tab;

})();
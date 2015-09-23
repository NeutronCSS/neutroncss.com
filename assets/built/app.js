(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-9531677-15', 'auto');
ga('send', 'pageview');



// Custom event tracking

// Download button
var downloadLinks = document.querySelectorAll('download-link');

function download() {
  ga('send', 'event', 'button', 'click', 'download-link');
}

for (var i = 0; i < downloadLinks.length; ++i) {
  var link = downloadLinks[i];
  
  link.addListener('click', download, false);
}	

var neutron = neutron || {};

neutron.column = (function () {
	'use strict';
	
	var column = {};
	column.target = "span";
	column.container = "#flexibility";
	column.input = document.querySelector("#column-input");
	column.value = 12;
	
	column.init = function() {
		column.input.addEventListener('keyup', changeColumn, false);
	}
	
	var changeColumn = function() {
		
		setTimeout(function () {
			var val = column.input.value.trim();
			if(val === 0 || val === "") {
				column.value = 12;
			} else {
				column.value = column.input.value
			}
			
			applyWidths();
		}, 500);

	}
	
	var applyWidths = function() {
		var columns = getColumns();
				
		for (var i = 0; i < columns.length; ++i) {

			var col = columns[i];
			
			col.removeAttribute("style");
									
			var widthPercentage = (100 / column.value) + "%";
			// var style = col.style;
			var style = window.getComputedStyle(col);
			
			// console.log("Col's styles: ", style);
			var marginLeft = parseFloat(style.getPropertyValue("margin-left"));
			var marginRight = parseFloat(style.getPropertyValue("margin-right"));
			
			// If margin is 0, use other side's margin (hacky fix)
			marginLeft = marginLeft || marginRight;
			marginRight = marginRight || marginLeft;
						
			var flushLeft = marginLeft / column.value;
			var flushRight = marginRight / column.value;
			
			var calcedWidth = widthPercentage + " - " + marginLeft + "px - " + marginRight + "px + " + flushLeft + "px + " + flushRight + "px";
			
			col.style.width = "calc(" + calcedWidth + ")";
			
		}
		
		var leftMarginCols = document.querySelectorAll(column.container + " > " + column.target + ":nth-of-type(" + column.value + "n+1)");
		var rightMarginCols = document.querySelectorAll(column.container + " > " + column.target + ":nth-of-type(" + column.value + "n+" + column.value + ")");
		
		for (var i = 0; i < leftMarginCols.length; ++i) {
			var col = leftMarginCols[i];
			
			col.style.marginLeft = 0;
		
		}
		
		for (var i = 0; i < rightMarginCols.length; ++i) {
			var col = rightMarginCols[i];
			col.style.marginRight = 0;
		}		
	}
	
	var getColumns = function() {
		var columns = document.querySelectorAll(column.container + " > " + column.target);

		return columns;
	}

	return column;
	
})();

var neutron = neutron || {};

neutron.tab = (function () {
	'use strict';

	// locally scoped Object
	var tab = {};
	tab.id = '';
	
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
	
	var hideAllExceptActive = function(active) {
		console.log('Hide all except: ',active);
		var elements = getElements();
		
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
	
	var removeActiveOnTab = function() {
		//var allElements = getElements();
		
		// Filter elements to only one that are active
		var attributeSelector = "[data-tabs$='.active'][data-tabs^='" + tab.id + "']";
		var element = document.querySelector(attributeSelector);
		
		var attr = element.getAttribute("data-tabs");
		attr = attr.substring(0, attr.length - 7);
		
		element.setAttribute("data-tabs", attr);
		
	}
	
	var changeActiveTab = function() {
		var attr = this.getAttribute("data-tabs").split('.');

		
		// remove any 'active' setting if set
		attr.splice(3, 1);
		
		// get label of active tab
		var activeTab = attr[2];
		
		// create new value for attribute
		var activeAttribute =  attr.join('.') + '.active';
		
		// Deactivate active tab
		removeActiveOnTab();
		
		// set clicked tab to be active
		this.setAttribute("data-tabs", activeAttribute);
		
		// After new active tab is set, re-hide elements
		hideAllExceptActive(activeTab);
		
	}

	var getElements = function() {
				
		var attributeSelector = "[data-tabs^=" + tab.id + "]";
	
		// Get matching tab elements
		return document.querySelectorAll(attributeSelector);

	}
	
	tab.init = function (tabId, options) {
		tab.id = tabId;

		// Get matching tab elements
		var elements = getElements();

		// Data structure of tabs
		var structure = getDataStructure(elements);

		// Hide all pages except for designated active page
		hideAllExceptActive(structure.active);
		
		// Set on click events
		setOnClickEvents(elements);
	
	};
	
	return tab;

})();
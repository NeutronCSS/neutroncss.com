(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-9531677-15', 'auto');
ga('send', 'pageview');



// Custom event tracking

// Download button
var downloadLinks = document.querySelectorAll('.download-link');
  console.log('Download links: ', downloadLinks);
  
function download() {
  console.log('Download button event triggered.');
  ga('send', 'event', 'button', 'click', 'download-link');
}

for (var i = 0; i < downloadLinks.length; ++i) {
  var link = downloadLinks[i];
  
  link.addEventListener('click', download, false);
}	

var neutron = neutron || {};

neutron.column = (function () {
	'use strict';
	
	var column = {};
	column.target = "span";
	column.container = "#flexibility";
	column.input = document.querySelector("#column-input");
	column.valueDefault = column.input.getAttribute("data-default");;
	column.value = column.valueDefault;
	
	column.init = function() {
		
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
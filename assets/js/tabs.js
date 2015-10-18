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
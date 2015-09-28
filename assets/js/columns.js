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

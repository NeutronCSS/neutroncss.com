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

var neutron = neutron || {};

neutron.column = (function () {
	'use strict';
	
	var column = {};
	column.target = "span";
	column.container = "#flexibility";
	column.input = document.querySelector("#column-input");
	column.value = 12;
	
	column.init = function() {
		console.log("Columns initialised");
		column.input.addEventListener('keyup', changeColumn, false);
	}
	
	var changeColumn = function() {
		console.log("Column changed...");
		column.value = column.input.value || column.value;
		
		applyWidths();

	}
	
	var applyWidths = function() {
		console.log("Applying widths...");
		var columns = getColumns();
		
		console.log("Columns to apply widths: ", columns);
				
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
			
			// console.log("Width to apply for col " + i + ": ", calcedWidth);
			
			col.style.width = "calc(" + calcedWidth + ")";
			
			// //First column
			// if (i % column.value === 0) {
			// 	col.style.marginLeft = 0;

			// }
			
			// //Last column
			// else if(i % column.value - 1 === 0) {
			// 	col.style.marginRight = 0;
			// }
			
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
	
	
	
	
	
	
	
	
	/*

	var addColumns = function(columnsToAdd) {


		
		var span = "<span></span>";
		var spanRepeat = "";
		
		for(var i = 0; i < columnsToAdd; i++){
			spanRepeat += span;
		}

		
		//var spanRepeat = new Array( columnsToAdd ).join( span );
		// var spanRepeat = (new Array(columnsToAdd + 1)).join(span);
		
		console.log('spanRepeat', spanRepeat);		
		
		column.container.innerHTML = spanRepeat;		
		
	}

	var removeAllColumns = function() {
		column.container.innerHTML = '';		
	}
	
	*/
	
	return column;
	
})();

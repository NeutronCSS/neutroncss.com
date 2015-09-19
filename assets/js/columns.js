var neutron = neutron || {};

neutron.column = (function () {
	'use strict';
	
	var column = {};
	column.elements = document.querySelectorAll("#flexibility span");
	column.container = document.querySelector("#flexibility");
	column.input = document.querySelector("#column-input");
	column.number = column.elements.length || 0;
	
	column.init = function() {
		
		setInputListener();
		
	}
	
	var changeColumnCount = function() {
		var currentColCount = column.elements.length;
		var newColCount = column.input.value || 0;
		console.log('newColCount', newColCount);
		
		removeAllColumns();

		addColumns(newColCount);
		
		column.number = newColCount;
		

	}
	
	var setInputListener = function() {
		console.log('Setting listener...');
		
		column.input.addEventListener('keyup', changeColumnCount, false);

	}
	
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
	
	return column;
	
})();

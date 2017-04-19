var org_scn_community_databound = {
	version : "3.0"
};

/**
 * Flattens data from tuple format to 2D Array
 * @author Mike Howles & Karol Kalisz
 * @param data { 
 *	 	"selection" : [Array of dimension selections] 	
 *	 	"tuples" : *Design Studio Tuples*,
 *		"data" : *Design Studio Data*,
 *   	"formattedData" : *Design Studio Formatted Data*,
 * 		"dimensions" : *Design Studio Metadata Dimensions JSON*,
 *		"locale" : *Design Studio user locale (e.g. en_US)",
 *	  	"axis_columns : [Array of Column Axis Dimension Selection Members]
 *	  	"axis_rows" : [Array of Row Axis Dimension Selection Members]
 *	 }
 * @param options {
 * 		ignoreResults : Boolean (default = true)
 *		ignoreExpandedNodes : Boolean (default = false)
 * 		swapAxes : Boolean (default = false)
 * 		useMockData : Boolean (default = true)
 * }
 * 
 * @return {
 * 		"dimensionHeaders" : [2D Array of dimensions used in rows]
 * 		"dimensionheader" : [1D Array of dimensions used in rows]
 * 		"columnHeaders" : [1D Array of Header Labels]
 * 		"columnHeaders2D" : [2D Array of Header Labels]
 * 		"rowHeaders" : [1D Array of Row Headers]
 *  	"rowHeaders2D" : [2D Array of Row Headers]
 * 		"values" : [2D Array of Measures] 
 *
 * }
 */
org_scn_community_databound.flatten = function (designStudioData, opts) {
	// Important - Copy the JSON object so we do not accidently change original object
	var data = jQuery.parseJSON(JSON.stringify(designStudioData));
	// Initialize with default options
	var options = org_scn_community_databound.initializeOptions();
	// Overwrite defaults with any passed options
	if(opts) {
		for(var option in opts) options[option] = opts[option];
	}
	// Create shell return object
	var retObj = {
		dimensionHeaders : [],		// ["Calendar Day", "Location", ...]
		dimensionHeadersKeys : [],	// ["0CALDAY", "0LOCATION", ...]
		dimensionHeader : "",		// "0CALDAY | 0LOCATION"
		dimensionColHeaders : [],	// ["0SALESREP", "0MEASURES", ...]		(TODO)
		dimensionColHeader : "",	// "0SALESREP | 0MEASURES"				(TODO)
		columnHeaders2D : [],		// Two Dimensions in Columns example:
									// [["John Doe", "Sales"],["John Doe", "Discounts"], ...]
									// Simple Example with just Measures Structure: 
									// [["Sales"],["Discounts"], ...]
		columnHeadersKeys2D : [],	// Two Dimensions in Columns example:
									// [["01", "SAL"],["02", "DIS"], ...]
									// Simple Example with just Measures Structure: 
									// [["SAL"],["DIS"], ...]
		columnHeaders : [],			// Two Dimension in Columns Example:
									// ["John Doe | Sales", "John Does | Discounts", ...]
									// Simple Example:
									// ["Sales", "Discounts", ...]
		columnHeadersKeys : [],		// Two Dimension in Columns Example:
									// ["001 | SALES", "001 | DISC", ...]
									// Simple Example:
									// ["SALES", "DISC", ...]
		rowLevels2D : [],			// [[-1,0],[-1,1]]	- For hierarchies
		rowHeaders2D : [],			// [["01/2015", "Memphis"],["01/2015", "Nashville"], ...]]
		rowHeadersKeys2D : [],		// [["01.2015", "MEMPHIS"],["01.2015", "NASHVILLE"], ...]]
		rowHeaders : [],			// ["01/2015 | Memphis", "01/2015 | Nashville", ...]
		rowHeadersKeys : [],		// ["01.2015 | MEMPHIS", "01.2015 | NASHVILLE", ...]
		values : [],				// [[100, 50], [200, 250], ...]
		formattedValues : [],		// [["100 USD", "50 USD"], ["200 USD", "250 USD"], ...]
		hash : {},					// {"01/2015 | Memphis" : 0, "01/2015 | Nashville" : 1, ... }
		geometry : {},				// {"rowLength" : "18", "colLength" : "2", "headersLength" : "2", "allColumnsLength" : "4" },
		hierarchies : []			// Registry of Hierarchies
									// [{ key : "0PROFIT_CTR" }, { key : "0ORG_UNIT"} ... ]

	};

	if(!data || !data.dimensions || (!data.data && !data.formattedData)) {
		if(!options.useMockData){
			throw("Incomplete data given.\n\n" + JSON.stringify(data));	
		}else{
			// Use Karol's mock data - Maybe dynamically load this?
			data = {"selection":[-1,-1,-1],"tuples":[[0,0,0],[1,0,0],[0,0,1],[1,0,1],[0,0,2],[1,0,2],[0,0,3],[1,0,3],[0,1,4],[1,1,4],[0,1,3],[1,1,3],[0,2,1],[1,2,1],[0,2,2],[1,2,2],[0,2,4],[1,2,4],[0,2,3],[1,2,3],[0,3,1],[1,3,1],[0,3,2],[1,3,2],[0,3,4],[1,3,4],[0,3,3],[1,3,3],[0,4,1],[1,4,1],[0,4,4],[1,4,4],[0,4,3],[1,4,3],[0,5,3],[1,5,3]],"data":["52.72","1","30.27","1","43.41","1","126.40","3","71.08","1","71.08","1","89.23","2","16.64","1","58.19","1","164.06","4","29.93","1","73.72","1","95.55","2","199.20","4","60.91","2","144.17","3","205.08","5","765.82","17"],"formattedData":["52.72 EUR","1","30.27 EUR","1","43.41 EUR","1","126.40 EUR","3","71.08 EUR","1","71.08 EUR","1","89.23 EUR","2","16.64 EUR","1","58.19 EUR","1","164.06 EUR","4","29.93 EUR","1","73.72 EUR","1","95.55 EUR","2","199.20 EUR","4","60.91 EUR","2","144.17 EUR","3","205.08 EUR","5","765.82 EUR","17"],"dimensions":[{"key":"4FW8C4P934W533L5W4N3J5AON","text":"Key Figures","axis":"COLUMNS","axis_index":0,"containsMeasures":true,"members":[{"key":"4FW8C4WXM3HULQ4M1YPFT79EF","text":"0BC_TURN","scalingFactor":0,"unitOfMeasure":"EUR","formatString":"#,##0.00 EUR;'-'#,##0.00 EUR"},{"key":"4FW8RN37GL043NF22OTQFXYL3","text":"0BC_COUNT","scalingFactor":0,"formatString":"#,##0;'-'#,##0"}]},{"key":"0BC_PERS1","text":"0BC_PERS1","axis":"ROWS","axis_index":0,"members":[{"key":"00002","text":"2"},{"key":"00003","text":"3"},{"key":"00007","text":"7"},{"key":"00008","text":"8"},{"key":"00009","text":"9"},{"key":"SUMME","text":"Overall Result","type":"RESULT"}]},{"key":"0BC_PROD1","text":"0BC_PROD1","axis":"ROWS","axis_index":1,"members":[{"key":"00002","text":"2"},{"key":"00003","text":"3"},{"key":"00008","text":"8"},{"key":"SUMME","text":"Result","type":"RESULT"},{"key":"00012","text":"12"}]}],"locale":"en_US","axis_columns":[[0,-1,-1],[1,-1,-1]],"axis_rows":[[-1,0,0],[-1,0,1],[-1,0,2],[-1,0,3],[-1,1,4],[-1,1,3],[-1,2,1],[-1,2,2],[-1,2,4],[-1,2,3],[-1,3,1],[-1,3,2],[-1,3,4],[-1,3,3],[-1,4,1],[-1,4,4],[-1,4,3],[-1,5,3]],"columnCount":2,"rowCount":18}
		}
	}
	/*
	 * If Swap Axes is set, simply swap row and column-specific properties.
	 */
	if(options.swapAxes){
		var tmp = data.axis_columns;
		data.axis_columns = data.axis_rows;
		data.axis_rows = tmp;
		for(var dI=0;dI<data.dimensions.length;dI++){
			var dim = data.dimensions[dI];
			var axis = dim.axis;
			if(axis=="ROWS") dim.axis="COLUMNS";
			if(axis=="COLUMNS") dim.axis="ROWS";
		}
	}
	retObj.dimensionCols = [];
	retObj.dimensionColsKeys = [];
	retObj.dimensionRows = [];
	retObj.dimensionHeaders = [];
	
	// put on object for external access
	retObj.geometry = retObj.geometry || {};
	retObj.geometry.colLength = data.axis_columns ? data.axis_columns.length : data.columnCount;
	retObj.geometry.rowLength = data.axis_rows ? data.axis_rows.length : data.rowCount;

	// save also the information of inital column and row length
	retObj.geometry.initialColLength = retObj.geometry.colLength;
	retObj.geometry.initialRowLength = retObj.geometry.rowLength;

	for(var dI=0;dI<data.dimensions.length;dI++){
		var dim = data.dimensions[dI];

		if(dim.axis == "ROWS") {
			retObj.dimensionRows.push({key: dim.key, text: dim.text, dimension: dim});
			retObj.dimensionHeaders.push(dim.text);
			retObj.dimensionHeadersKeys.push(dim.key);
		}
		if(dim.axis == "COLUMNS") {
			retObj.dimensionCols.push({key: dim.key, text: dim.text, dimension: dim});
			retObj.dimensionColsKeys.push({key: dim.key, text: dim.key});
		}
	}
	
	var tupleIndex = 0;
	// Make Row Header Labels
	
	for(var row=0;row<retObj.geometry.initialRowLength;row++){
		var newValueRow = [];
		var newFormattedValueRow = [];
		var rowHeader = "";
		var rowHeaderKey = "";
		var rowHeader2D = [];
		var rowLevel2D = [];
		var rowHeaderKey2D = [];
		var rowAxisTuple = data.axis_rows ? data.axis_rows[row]: data.tuples[row];
		var sep = "";
		var isResult = false;
		var isExpanded = false;
		for(var j=0;j<rowAxisTuple.length;j++){
			var currentDimension = data.dimensions[j];
			if(rowAxisTuple[j] != -1){
				if(options.ignoreResults || options.ignoreExpandedNodes) {
					var member = currentDimension.members[rowAxisTuple[j]];
					if(member.type == "RESULT") { isResult=true;}
					if(member.nodeState){
						var dimFound = -1;
						for(var h=0;h<retObj.hierarchies.length;h++){
							if(retObj.hierarchies[h].key == currentDimension.key) {
								dimFound = h;
							}
						}
						if(dimFound == -1) {	// New Hierarchy registered
							retObj.hierarchies.push({
								key : currentDimension.key,
								text : currentDimension.text,
								deepestLevel : 0
							});
						}else{
							var hier = retObj.hierarchies[dimFound];
							if(member.level) {
								if(member.level > hier.deepestLevel) hier.deepestLevel = member.level;
							}
						}
						if(member.nodeState == "EXPANDED") { isExpanded=true;}
					}
					// also hierarchy nodes should be ignored, but this need more work, some code snippet
					// if(member.type == "HIERARCHY_NODE" && member.level == 1 && member.nodeState == "EXPANDED") { isResult=true; break;}
				}

				rowHeader += sep + currentDimension.members[rowAxisTuple[j]].text;
				rowHeaderKey += sep + currentDimension.members[rowAxisTuple[j]].key;
				rowHeader2D.push(currentDimension.members[rowAxisTuple[j]].text);
				rowLevel2D.push(currentDimension.members[rowAxisTuple[j]].level || 0);
				rowHeaderKey2D.push(currentDimension.members[rowAxisTuple[j]].key);
				
				if(isResult || isExpanded) {
					break;
				}
				
				sep = options.dimensionSeparator;
			}
		}
		
		if((isResult && options.ignoreResults) || (isExpanded && options.ignoreExpandedNodes)) { // Added if clause - Mike
			retObj.geometry.rowLength = retObj.geometry.rowLength - 1;
			// move the tupleIndex by the skipped values
			tupleIndex = tupleIndex + retObj.geometry.colLength;
			continue; 
		}else{
			retObj.hash[rowHeader] = row;
			retObj.rowHeaders.push(rowHeader);
			retObj.rowHeadersKeys.push(rowHeaderKey);
			retObj.rowHeaders2D.push(rowHeader2D);
			retObj.rowHeadersKeys2D.push(rowHeaderKey2D);
			retObj.rowLevels2D.push(rowLevel2D);
		}
		
		for(var col=0;col<retObj.geometry.colLength;col++){
			if(data.data && data.data.length > 0){
				newValueRow.push(data.data[tupleIndex]);
			}

			// there are cases that no formatedValues are given, using unformated values in this case.
			if(data.formattedData && data.formattedData.length > 0){
				newFormattedValueRow.push(data.formattedData[tupleIndex]);
			} else {
				newFormattedValueRow.push(""+data.data[tupleIndex]);
			}
			tupleIndex++;
		}

		if(newValueRow.length>0) retObj.values.push(newValueRow);
		if(newFormattedValueRow.length>0) retObj.formattedValues.push(newFormattedValueRow);	
	}
	
	var spliceIndexCorrection = 0;
	
	// Make Column Header Labels and Strip out columns containing totals
	for(var col=0;col<retObj.geometry.initialColLength;col++){
		var colHeader = "";
		var colHeaderKey = "";
		var colHeader2D = [];
		var colHeaderKey2D = [];
		var colAxisTuple = data.axis_columns ? data.axis_columns[col] : undefined;
		var sep = "";
		var removeColumn = false;
		if(colAxisTuple) {
			for(var j=0;j<colAxisTuple.length;j++){
				if(colAxisTuple[j] != -1){
					if(
						(options.ignoreResults && data.dimensions[j].members[colAxisTuple[j]].type == "RESULT") || 	// Ignore Results case
						(options.ignoreExpandedNodes && data.dimensions[j].members[colAxisTuple[j]].nodeState=="EXPANDED")) // Ignore Expanded node case
						{
						removeColumn = true;
					}
					colHeader += sep + data.dimensions[j].members[colAxisTuple[j]].text;
					colHeaderKey += sep + data.dimensions[j].members[colAxisTuple[j]].key;
					colHeader2D.push(data.dimensions[j].members[colAxisTuple[j]].text);
					colHeaderKey2D.push(data.dimensions[j].members[colAxisTuple[j]].key);
					
					if(removeColumn) {
						break;
					}
					
					sep = options.dimensionSeparator;			
				}
			}			
		} else {
			// find all colum dimensions
			var dimensionCols = retObj.dimensionCols;
			for(var j=0;j<dimensionCols.length;j++){
				if(
					(options.ignoreResults && dimensionCols[j].dimension.members[col].type == "RESULT") || 	// Ignore Results case
					(options.ignoreExpandedNodes && dimensionCols[j].dimension.members[col].nodeState=="EXPANDED")) // Ignore Expanded node case
					{
						removeColumn = true;
					}
					
					colHeader += sep + dimensionCols[j].dimension.members[col].text;
					colHeaderKey += sep + dimensionCols[j].dimension.members[col].key;
					colHeader2D.push(dimensionCols[j].dimension.members[col].text);
					colHeaderKey2D.push(dimensionCols[j].dimension.members[col].key);
					
					if(removeColumn) {
						break;
					}
					
					sep = options.dimensionSeparator;
			}
		}

		if(removeColumn){
			for(var row=0;row<retObj.geometry.initialRowLength;row++){
				if(retObj.values[row]) {
					retObj.values[row].splice(col - spliceIndexCorrection,1);
				}
				if(retObj.formattedValues[row]) {
					retObj.formattedValues[row].splice(col - spliceIndexCorrection,1);
				}
			}
			retObj.geometry.colLength = retObj.geometry.colLength - 1;
			
			spliceIndexCorrection++;
		}else{
			retObj.columnHeaders.push(colHeader);
			retObj.columnHeadersKeys.push(colHeaderKey);
			retObj.columnHeaders2D.push(colHeader2D);
			retObj.columnHeadersKeys2D.push(colHeaderKey2D);
		}		
	}
	
	if(retObj.rowHeaders2D[0]) {
		retObj.geometry.headersLength = retObj.rowHeaders2D[0].length;	
	} else {
		retObj.geometry.headersLength = 0;
	}
	
	retObj.geometry.allColumnsLength = retObj.geometry.headersLength + retObj.geometry.colLength;

	if(options.keepDataArray){
		retObj.data = data.data;
	}
	return retObj;
};

org_scn_community_databound.hasData = function (data) {
	
	if(!data || data == "" || data == "null" || data == undefined) {
		return false;
	}
	
	if(data.values == undefined && data.data == undefined) {
		return false;
	}

	return true;
};

org_scn_community_databound.initializeOptions = function () {
	var options = {};
	
	options.iMaxNumber = 100;
	options.iTopBottom = "Both";
	options.iSortBy = "Default";
	options.iDuplicates = "Ignore";
	options.iNumberOfDecimals = 2;
	options.allKeys = false;
	options.idPrefix = "";
	options.iDisplayText = "Text";
	options.iNullValues = "Use";
	options.ignoreResults = false;
	options.ignoreExpandedNodes = false;
	options.useMockData = true;
	options.dimensionSeparator = " | ";
	options.createHaderRow = true;
	options.swapAxes = false;
	
	options.conditionColumns = undefined; // JSON condition definition, work in progress, eg. {"operator": "and", "rules": [{"condition": "contains", "members": ["AUSC", "AUSA"]}]}
	options.conditionRows = undefined; // JSON condition definition, work in progress
	options.conditionContent = undefined; // JSON condition definition, work in progress
	options.collectMultiple = true;

	options.emptyDataValue = "";
	options.emptyHeaderValue = "";
	
	options.formattingCondition = {};
	options.formattingCondition.operator = undefined;
	options.formattingCondition.rules = [];

	options.keepDataArray = false;
	options.iIgnoreAverage = false;
	options.average = undefined;

	return options;
};
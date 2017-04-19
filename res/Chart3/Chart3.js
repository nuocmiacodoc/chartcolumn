
var _data;
var _dim;
var _icondata;
var _chartdata;
var _textdata;
var _flattendata;
var _dimrowMembers;
var _maxValue;
var _tickvalue;
var scn_pkg="com.gcs.ebs.bi.";
if (sap.firefly != undefined) { scn_pkg = scn_pkg.replace(".", "_"); }


define([
        "../../os/viz-modules/VizCore",
        "d3",
        "sap/designstudio/sdk/component",
        "css!./Chart3.css",
        "../../modules/component.flatdata"], function(VizCore, d3, Component, css) {
	var ownComponentName = "com.gcs.ebs.bi.databound.Chart3";
	Chart3.prototype = VizCore;
	
	 function Chart3() {
// declare chart aps
			VizCore.call(this,{
	            pos : {
	                opts : {
	                	apsControl : "combobox",
	                    desc : "Position",
	                    cat : "Icons",
	                    options : [
	                               	{key : "none", text : "None"},
	                               	{key : "above", text : "Above"},
									{key : "below", text : "Below"}]
									
	                }
	            },
	            
	            iconheight : {
					opts : {
						desc : "Icon Height",
						cat : "Icons",
						apsControl : "spinner"
					}
				},
	            
	            iconwidth : {
					opts : {
						desc : "Icon Width",
						cat : "Icons",
						apsControl : "spinner"
					}
				},
	            
	            dim : {
					opts : {
						desc : "Dimensions Table",
						cat : "Dimensions",
						apsControl : "datadisformat"
					}
				}
			});

//getter and setter function
		var that = this;
	    this.data = function(value) { if (value === undefined) { return this._data; } else { this._data = value; return this; } };
	    this.DSwapAxes = function(value) { if (value === undefined) { return this._DSwapAxes; } else { this._DSwapAxes = value; return this; } };
	    this.DHideSuperLevels = function(value) { if (value === undefined) { return this._DHideSuperLevels; } else { this._DHideSuperLevels = value; return this; } };
		this.getMetaData = function()
		{
			if (this._data === undefined) return this._data;
			else
				{
				var a;
            	 for(var i =0;i<_data.dimensions.length;i++)
            	 if(this._data.dimensions[i].axis !== "COLUMNS" )
            		 {
            		 a = i;
            		 break;
            		 }
				return  JSON.stringify(this._data.dimensions[a]);
				}
		}

	  
		
		this.init = function() {
			this.$().addClass("g-chart g-main-chart");
		};
		
// start of afterUpdate
		this.afterUpdate = function() {
		_data = that._data;
		_dim = that.dim();
		var dimData = that.dim();
		this.$().html("");
		
		if (!org_scn_community_databound.hasData(that._data)) {
			d3.select(".g-main-chart").append("div")
				.attr("class", "componentLoadingState zenLoadingStateOpacity");
			d3.select(".g-main-chart").append("div")
				.attr("class", "componentLoadingStateBox zenLoadingStateOpacity75")
				.text("Assign a data source");
			return;
		}
		
		var options = org_scn_community_databound.initializeOptions();
		options.ignoreResults = true;
		var flatData = org_scn_community_databound.flatten(that._data, options);
		_flattendata = flatData;
		
//obtain data from flatten data
		var chartData = [];
		var index = 0;
		for (var iR = 0; iR < flatData.geometry.rowLength; ++iR) {
			for (var iC = 0; iC < flatData.geometry.colLength; ++iC) {
				var tmpData = {};
					tmpData.row_name = flatData.rowHeaders2D[iR][0];//index
					tmpData.full_rowname = flatData.rowHeaders[iR];
					tmpData.y = flatData.values[iR][iC]; //This is correct.
					tmpData.column_name = flatData.columnHeaders[iC];
					tmpData.index = index;
					chartData.push(tmpData);
					++index;
			}
		}
		jsonData = chartData;
_chartdata = jsonData;

//transform dimensional text into textxAxis
//get the numbers of cells in each dimension
var textxAxis = [];
var dimrowMembers = [];
var count = 0;

for(var i=0; i<chartData.length;i++)
	{
	if(i===0)
		{
		textxAxis[0] = chartData[0].row_name;
		++count;
		}
	else if (chartData[i].row_name !== chartData[i-1].row_name)
		{
		textxAxis[count] = chartData[i].row_name;
		dimrowMembers[count -1] = i;
		//i is the number of cells in 1 dimension.
		++count;
		}
		//
	}
dimrowMembers[count -1] = chartData.length;

_textdata = textxAxis;
_dimrowMembers = dimrowMembers;

//find the max value of each dimension
var maxValue = [];
for(var i =0; i<dimrowMembers.length; i++)
	{
	if(i === 0)
		{
		maxValue[i] = Math.max.apply(null,that._data.data.slice(0,dimrowMembers[0]));
		}
	else
		{
		maxValue[i] = Math.max.apply(null,that._data.data.slice(dimrowMembers[i-1],dimrowMembers[i]));
		}
	}
_maxValue = maxValue;

//data to draw icon of each row			
		var iconData = [];
		try {
		for (var iR = 0; iR < textxAxis.length; ++iR) {
			var tmpData = {};
			for(var j = 0 ; j < dimData.length;j++)
				{
				if (textxAxis[iR] === dimData[j].dimKey)
					{
						tmpData.row_name = textxAxis[iR];//index
						tmpData.max_value = maxValue[iR];
						tmpData.value = dimData[j].format;
						break;
					}
				else if (j === that.dim().length - 1)
					{
						tmpData.row_name = textxAxis[iR];//index
						tmpData.max_value = maxValue[iR];
						tmpData.value = "";
					}
				}
			iconData.push(tmpData);
		}
		}
		catch(e) {};
		
_icondata = iconData;
		
//format axis			
		var formatYear = function(d) { return getSubLevel(d); },
		    format = d3.format(",.1f"),
		    formatHover = d3.format(",.2f"),
		    formatBattingAverage = d3.format(".3f"),
		    formatOrdinal = function (i) {
			    var j = i % 10;
			    if (j == 1 && i != 11) {
			        return i + "st";
			    }
			    if (j == 2 && i != 12) {
			        return i + "nd";
			    }
			    if (j == 3 && i != 13) {
			        return i + "rd";
			    }
			    return i + "th";
			};


//start drawing chart			
		
		var margin = {top: 50, right: 100, bottom: 150, left: 100},
			width = that.$().outerWidth(true) - margin.left - margin.right,
	    	height = that.$().outerHeight(true) - margin.top - margin.bottom,
		    bounds = d3.geom.polygon([[0, 0], [0, height], [width, height], [width, 0]]);
		//----------------------------------------------------------------------------------
		var g = d3.select(".g-main-chart").append("svg")
		    .attr("width", (width + margin.left + margin.right))
		    .attr("height", (height + margin.top + margin.bottom))
		    .append("g")
		    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		var main_chart = g.append("g").attr("class","main-chart");
//declare x axis
		var x0 = d3.scale.ordinal()
	    .rangeRoundBands([0, width], .05, 0);
		x0.domain(textxAxis);
		
		var rangeX = x0.rangeBand();
		var padding = .05;
		var tickvalue = x0.range() ;
		
		var div = d3.select(".g-main-chart").append("div")	
	    .attr("class", "tooltip")				
	    .style("opacity", 0);
		_tickvalue = tickvalue;
		
		var xAxis = d3.svg.axis()
	    .scale(x0)
	    .outerTickSize(0)
	    .orient("bottom");
		
//declare y axis	
		var y = d3.scale.linear()
	    .range([height, 0]);
		y.domain([-1000000, d3.max(that._data.data)]);
		var yAxis = d3.svg.axis()
	    .scale(y)
	    .outerTickSize(0)
	    .orient("left")
	    .ticks(null,"s");
		
// declare color of bars		
		var z = d3.scale.ordinal()
	    .range([  "#6b486b", "#ff8c00" , "#d0743c", "#a05d56","#98abc5", "#8a89a6", "#7b6888", "#a05d56"]);
		//var iconColor = d3.scale.ordinal().range (["#FF0000","#FFA500","#FFFF00","#008000","#0000FF","#000000","#FFC0CB","#9ACD32","#808080"])
		
		var xaxis =  main_chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);
		var tickAxis = xaxis.selectAll("line").attr("transform","translate("+(21*rangeX/40)+",0)");
		var textAxis = xaxis 
			.selectAll("text")
	      .style("text-anchor", "end")
	      .attr("dx", "-.8em")
	      .attr("dy", "-.20em")
	      .attr("transform", "rotate(-90)" )
	      .attr("font-size", rangeX/4);
		
		//alert(rangeX);

		var yaxis = main_chart.append("g")
			.attr("class", "y axis")
			.call(yAxis);
		var textyAxis = yaxis 
		.selectAll("text")
		.attr("font-size", height/(2.2*9));
		var bardomain = Math.ceil(((flatData.geometry.rowLength)/textxAxis.length)*flatData.geometry.colLength);
		var rangeColumn = (3*rangeX)/(4*bardomain);

// draw all bars		
		 main_chart.selectAll(".bar")
	      .data(jsonData)
	      .enter()
	      .append("rect")
	      	.attr("class", "bar")
	      	.attr("x", function(d) {
	      		var a = x0(d.row_name);
	      		var t = d3.scale.linear().domain([0,bardomain]).range([a, a + rangeX]);
	      		return (t(d.index % bardomain) + rangeColumn/6);
	      		})
	      	.attr("y", function(d) { return y(d.y); })
	      	.attr("height", function(d) { return height - y(d.y); })
	      	.attr("width", rangeColumn )
	      	.attr("fill", function(d) { return  z(d.column_name)})
		 .on("mouseover", function(d) {		
	            div.transition()		
	                .duration(200)		
	                .style("opacity", .9);		
	            div	.html("Value: "+d.y + "<br/>" +"Name: " + d.full_rowname)	
	                .style("left", (d3.event.pageX - 30) + "px")		
	                .style("top", (d3.event.pageY - 30) +  "px");	
	            })					
	        .on("mouseout", function(d) {		
	            div.transition()		
	                .duration(500)		
	                .style("opacity", 0);	
	        });

//draw legend	
		var legend = g.append("g")
		.attr("class","legend")
	      .attr("transform", "translate("+margin.right+", 0)")
	    .selectAll("g")
	    .data(flatData.columnHeaders.reverse())
	    .enter().append("g")
	      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

		  legend.append("rect")
		      .attr("x", width - 19)
		      .attr("width", 19)
		      .attr("height", 19)
		      .attr("fill", z);

		  legend.append("text")
		      .attr("x", width - 24)
		      .attr("y", 9.5)
		      .attr("dy", "0.32em")
		      .text(function(d) { return d; });
//--------------------------------------------------------------------------------------------------------------
			
			/** Return the sub level of a header, e.g. "A | B" -> "B" */
			function getSubLevel(header, separator) {
				if (separator === undefined)
					separator = options.dimensionSeparator.trim();
				return header.slice(header.lastIndexOf(separator) + 1).trim();
			};
			
			/** Return the super level of a header, e.g. "A | B" -> "A" */
			function getSuperLevel(header, separator) {
				if (separator === undefined)
					separator = options.dimensionSeparator.trim();
				i = header.lastIndexOf(separator);
				if (i < 0)
					i = 0; // the separator doesn't exist so we get nothing
				return header.slice(0, i).trim();
			};
			
//draw icon follow its position					
		function drawBelow()
		{
			textAxis.attr("x", - that.iconheight());
			var icon =  main_chart.append("g").attr("class","iconHeader");
			icon.selectAll("image").data(iconData)
			.enter()
			.append("image")
				.attr("class", "icon-image")
				.attr("x",function(d) { return x0(d.row_name) + x0.rangeBand()/12;})
				.attr("y", height + 3)
				.attr("height", that.iconheight())
				.attr("width", that.iconwidth())
				.attr("xlink:href", function(d) { return  (d.value)});
			d3.select("svg")
			.attr("height",width + margin.left + margin.right + that.iconheight())
		}

		function drawAbove()
		{
			var icon =  main_chart.append("g").attr("class","iconHeader");
			icon.selectAll("image").data(iconData)
			.enter()
			.append("image")
				.attr("class", "icon-image")
				.attr("x",function(d) { return x0(d.row_name) + x0.rangeBand()/12;})
				.attr("y", function(d) { return y(d.max_value) -60; })
				.attr("height", that.iconheight())
				.attr("width", that.iconwidth())
				.attr("xlink:href", function(d) { return (d.value)});
		}
			
		if(that.pos() === "below")
			drawBelow();
		else if (that.pos()==="above")
			drawAbove();
		else return;
		
//End of after update!
		};
		

//--------------------------------------------------------------------------------------------------------------
		/**
		 * Relays Data Source Metadata over to Additional Properties Sheet.
		 */
		this.getAPSMetaData = function(){
			try{
				return JSON.stringify({
	    			msg : "Success",
	    			data : that._data //this.data()
	    		});	
			}catch(e){
				var errMsg = "Component error in getAPSMetaData:\n\n" + e;
	    		return JSON.stringify({
	    			msg : errMsg,
	    			data : {}
	    		})
				alert(errMsg);
			}
		}
		/**
		 * Relays Flattened Data to Additional Properties Sheet.
		 */
		this.getAPSFlatData = function(){
			try{
				return JSON.stringify({
	    			msg : "Success",
	    			data : flatData //this.flatData
	    		});
	    	}catch(e){
	    		var errMsg = "Problem returning flattened data to APS.\n\n" + e;
	    		return JSON.stringify({
	    			msg : errMsg,
	    			data : {}
	    		})
				alert(errMsg);
			}
		}
		
	}; 
	Chart3.prototype.constructor = Chart3;
	Chart3.prototype.toString = function(){
		return ownComponentName;
	}
	Component.subclass(ownComponentName, Chart3);
});

var scn_pkg="com.gcs.ebs.bi.";if(sap.firefly!=undefined){scn_pkg=scn_pkg.replace(".","_");}

define([
		"../../os/viz-modules/VizCoreDatabound",
		"d3",
		"sap/designstudio/sdk/component",
		"css!./BeatChart.css",
		"../../modules/component.databound",
		"css!../../os/multiple-select/multiple-select.css",
		//"./plugins/multiple-select"], //http://wenzhixin.net.cn/p/multiple-select/
		"../../os/multiple-select/multiple-select.min"],
	function(VizCoreDatabound, d3, Component, css) {

	var ownComponentName = "com.gcs.ebs.bi.databound.BeatChart";
	BeatChart.prototype = VizCoreDatabound;

	function BeatChart() {

	    var that = this;
		var flatData;
		var swapAxisOld;

		VizCoreDatabound.call(this,{
			// Colors in Beat Chart
			pointColor : {
				opts : {
					desc : "Point Color",
					cat : "Cosmetics-Colors",
					apsControl : "color"
				}
			},
			selectedLineColor : {
				opts : {
					desc : "Selected Line Color",
					cat : "Cosmetics-Colors",
					apsControl : "color"
				}
			},
			selectedPointColor : {
				opts : {
					desc : "Selected Point Color",
					cat : "Cosmetics-Colors",
					apsControl : "color"
				}
			},
			meanLineColor : {
				opts : {
					desc : "Mean Line Color",
					cat : "Cosmetics-Colors",
					apsControl : "color"
				}
			},
			meanPointColor : {
				opts : {
					desc : "Mean Point Color",
					cat : "Cosmetics-Colors",
					apsControl : "color"
				}
			},
			// Legend box
			DShowLegend : {
				opts : {
					desc : "Show Legend",
					cat : "Legend",
					apsControl : "checkbox"
				}
			},
			DLegendOpacity : {
				opts : {
					desc : "Legend Opacity (%)",
					cat : "Legend",
					apsControl : "spinner"
				}
			},
			DLegendWidth : {
				opts : {
					desc : "Legend Width (px)",
					cat : "Legend",
					apsControl : "spinner"
				}
			},
			DLegendLeft : {
				opts : {
					desc : "Legend Left (px)",
					cat : "Legend",
					apsControl : "spinner"
				}
			},
			DLegendTop : {
				opts : {
					desc : "Legend Top (px)",
					cat : "Legend",
					apsControl : "spinner"
				}
			},
			hideXAxisLabel : {
				opts : {
					desc : "Hide X-Axis Label",
					cat : "Axis-X Axis",
					apsControl : "checkbox"
				}
			},
			xAxisLabel : {
				opts : {
					desc : "X-Axis Label",
					cat : "Axis-X Axis",
					apsControl : "text.vanqm"
				}
			},
			xAxisLabelPaddingLeft : {
				value : 0,
				opts : {
					desc : "X-Axis Label - Padding Left",
					cat : "Axis-X Axis",
					apsControl : "spinner"
				}
			},
			xAxisLabelPaddingTop : {
				value : 0,
				opts : {
					desc : "X-Axis Label - Padding Top",
					cat : "Axis-X Axis",
					apsControl : "spinner"
				}
			},
			rotateXAxisValue45 : {
				opts : {
					desc : "Rotate X-Axis Value 45",
					cat : "Axis-X Axis",
					apsControl : "checkbox"
				}
			},
			hideYAxisLabel : {
				opts : {
					desc : "Hide Y-Axis Label",
					cat : "Axis-Y Axis",
					apsControl : "checkbox"
				}
			},
			yAxisLabel : {
				opts : {
					desc : "Y-Axis Label",
					cat : "Axis-Y Axis",
					apsControl : "text.vanqm"
				}
			},
			yAxisLabelPaddingLeft : {
				value : 0,
				opts : {
					desc : "Y-Axis Label - Padding Left",
					cat : "Axis-Y Axis",
					apsControl : "spinner"
				}
			},
			yAxisLabelPaddingTop : {
				value : 0,
				opts : {
					desc : "Y-Axis Label - Padding Top",
					cat : "Axis-Y Axis",
					apsControl : "spinner"
				}
			},
			yAxisOrientation : {
				opts : {
					apsControl : "combobox",
					desc : "Y-Axis Orientation",
					cat : "Axis-Y Axis",
					options : [{key : "left", text : "Left"},
								{key : "right", text : "Right"}]
				}
			},
			tickFiltering : {
				opts : {
					desc : "Reduce the number of ticks by",
					cat : "Axis-X Axis",
					apsControl : "spinner"
				}
			},
			paddingLeft : {
				opts : {
					desc : "Padding Left",
					cat : "Cosmetics-Padding",
					apsControl : "spinner"
				}
			},
			paddingRight : {
				opts : {
					desc : "Padding Right",
					cat : "Cosmetics-Padding",
					apsControl : "spinner"
				}
			},
			paddingTop : {
				opts : {
					desc : "Padding Top",
					cat : "Cosmetics-Padding",
					apsControl : "spinner"
				}
			},
			paddingBottom : {
				opts : {
					desc : "Padding Bottom",
					cat : "Cosmetics-Padding",
					apsControl : "spinner"
				}
			},
			showTitle : {
				value : true,
				opts : {
					desc : "Show Title",
					cat : "Cosmetics-Title",
					apsControl : "checkbox"
				}
			},
			chartTitle : {
				opts : {
					desc : "Title",
					cat : "Cosmetics-Title",
					apsControl : "text.vanqm"
				}
			},
			titleTop : {
				opts : {
					desc : "Title Top (px)",
					cat : "Cosmetics-Title",
					apsControl : "spinner"
				}
			},
			titleLeft : {
				opts : {
					desc : "Title Left (px)",
					cat : "Cosmetics-Title",
					apsControl : "spinner"
				}
			}
		});
		this.componentInfo.title = "Beat Chart";
		this.componentInfo.description = "Beat Chart Description";
		this.componentInfo.author = "[GCS] Long Hoang";
		this.componentInfo.icon = "data:image/png;base64,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";
		this.componentInfo.topics.splice(1,0,{
			title : "Beat Chart License",
			content : '<a rel="license" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFAAAAAPCAIAAAD8q9/YAAABqklEQVRIx+WWMU8CMRTH3wewxRvZoGp0IpJOhDhwdMP1JhLHY3DSwU4kxAHYMIGlX+Gc1MXA4AQhpPEb8BX6FWq05Dyhd3Ju573ccGnea+/3/u+9K0AOTefGvoEfn4Lo07nuAMBwOLSGMcYwxhMxNs6r91XhsJAJXe3AEzHGGMfRhsynZ6fGf/o27fV6GQauX9TL5XJybUgpAaB91TYhS7lsXbayCowwMvJKKQkhAMAYU0oxxgCAECKlNCJXaTWs6tHDyDoXtg/7+W5djEZZnRNOSfC3A3fvuwAwm8201oQQz/O01vzLHMdRSgkhgiAwiwijsKrni7l1962XuA/azY41WXE5SucfBb69uwEAKaVSKjq3PM+jlEarmnOOMTZRL6/Pi9UiIfdWGeMg41Kzu+euvAkip1CYMeb7vlGYcy6E2CiMUiickHtrGf+q2FbsHxX+7GG06eEgCBzHAQDf98MeppSu12utdbPZrJxX9uzh/YH37+G4MZEauFavlUqlHE3piRgjdDAYDBKAXdc9Pjn6J//hcHT1+30rbcNtFIvFbN+08nWXzpV9AD9ivwErgn5oAAAAAElFTkSuQmCC" /></a>'+
			'<br /><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">BeatChart</span> by <span xmlns:cc="http://creativecommons.org/ns#" property="cc:attributionName">[GCS] Long Hoang</span> is licensed under a <a rel="license" target="_blank" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License</a>.<br />Based on a work at <a xmlns:dct="http://purl.org/dc/terms/" target="_blank" href="http://github.com/org-scn-design-studio-community/sdkpackage/tree/master/src/org.scn.community.databound/res/BeatChart" rel="dct:source">sdkpackage repository on Github</a>.'
		});


		this.init = function() {
			that.$().addClass("g-chart g-main-chart");
		};

		this.afterUpdate = function() {
			that.$().html("");

			// Check to know the '_data' exist or not.
			// If '_data' does not exist, show dialog to request data and return.
			if (!org_scn_community_databound.hasData(that.data())) {
				d3.select("#" + that.$().attr("id")).append("div")
					.attr("class", "componentLoadingState zenLoadingStateOpacity");
				d3.select("#" + that.$().attr("id")).append("div")
					.attr("class", "componentLoadingStateBox zenLoadingStateOpacity75")
					.text("Assign a data source");
				return;
			}

			var options = org_scn_community_databound.initializeOptions();
			options.ignoreResults = that.ignoreTotals();
			options.ignoreExpandedNodes = that.ignoreExpandedNodes();
			options.useMockData = that.useMockData();
			options.swapAxes = that.swapAxes();

			that.flatData = org_scn_community_databound.flatten(that.data(), options);

			var formatYear = function(d) {
			    // remove thousands separators
				return getSubLevel(d).replace(/[,.]/g, "");
			};
			var format = d3.format(",.1f");
			var formatHover = d3.format(",.2f");
			var formatBattingAverage = d3.format(".3f");
			var formatOrdinal = function (i) {
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

			var selectedTeam;

			//
			// main scatterplot at top
			//

			//var padding = {top: 50, right: 55, bottom: 30, left: 40};
			var padding = {top: that.paddingTop(), right: that.paddingRight(), bottom: that.paddingBottom(), left: that.paddingLeft()};
			var width = that.$().outerWidth(true) - padding.left - padding.right;
			var height = that.$().outerHeight(true) - padding.top - padding.bottom;
			var bounds = d3.geom.polygon([[0, 0], [0, height], [width, height], [width, 0]]);

			var x = d3.scale.ordinal()
				.domain(that.flatData.columnHeaders)
				.rangePoints([0, width], 1);

			var y = d3.scale.linear()
				.domain([0, d3.max(that.flatData.values, function(array) { return d3.max(array); })])
				.range([height, 0]);

			var chartData = [];
			for (var iC = 0; iC < that.flatData.geometry.colLength; ++iC) {
				for (var iR = 0; iR < that.flatData.geometry.rowLength; ++iR) {
					var tmpData = {};
					tmpData.x = iC;//index
					tmpData.y = that.flatData.values[iR][iC];
					tmpData.name = that.flatData.rowHeaders[iR];
					if (tmpData.y === null)
					    continue;
					chartData.push(tmpData);
				}
			}
			fixYScale(chartData, d3.max(that.flatData.values, function(array) { return d3.max(array); }));

			var xAxis = d3.svg.axis()
				.scale(x)
				.orient("bottom")
				.tickValues(x.domain().filter(function(d, i) { return !(i % that.tickFiltering()); }))
				.tickSize(4)
				.tickFormat(formatYear)
				.tickPadding(2);

			var yAxis = d3.svg.axis()
				.scale(y)
				//.orient("right")
				.orient(that.yAxisOrientation())
				.ticks(10)
				.tickPadding(10)
				.tickSize( -width);

			var svg = d3.select("#" + that.$().attr("id")).append("svg")
			.attr("width", (width + padding.left + padding.right))
			.attr("height", (height + padding.top + padding.bottom));

			// Draw Chart Title
			if(that.showTitle()) {
				var title = svg.append("g")
					.attr("class", "v-m-title")
					.attr("transform", "translate(" + that.titleLeft() + ", " + that.titleTop() + ")");
				title.append("rect")
					.attr("class", "v-bound")
					.attr("width", width)
					.attr("height", "19")
					.attr("fill", "transparent");
				title.append("text")
					.attr("class", "v-title viz-title-label")
					.attr("text-rendering", "geometricPrecision")
					.attr("font-family", "'Open Sans', Arial, Helvetica, sans-serif")
					.attr("font-size", "16px")
					.attr("font-weight", "bold")
					.attr("font-style", "normal")
					.attr("text-anchor", "middle")
					.attr("x", width / 2)
					.attr("y", "9.5")
					.attr("dominant-baseline", "central")
					.attr("fill", "#333333")
					.text(this.chartTitle());
			}

			svg = svg.append("g")
				.attr("transform", "translate(" + padding.left + "," + (10 + padding.top) + ")");

			//
			// main scatterplot
			//

			// Draw x-axis text
			// [vanqm] Should we rotate the x-value base on drawing y-value in left/right side???
			if(that.rotateXAxisValue45()) {
				var dy;
				var dx;
				var rotate;
				if(that.swapAxes()) {
					dx = ".0em";
					dy = "1.4em";
				} else {
					dx = "-.8em";
					dy = "0.7em";
				}
				rotate = "rotate(45)";
				svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + height + ")")
					.call(xAxis)
					.selectAll("text")
						.style("text-anchor", "end")
						.attr("dx", dx)
						.attr("dy", dy)
						.attr("transform", rotate);
			} else {
				svg.append("g")
				.attr("class", "x axis")
				.attr("transform", "translate(0," + height + ")")
				.call(xAxis)
			}

			var labelText;

			// Add the text label for the x axis
			if (!that._DHideSuperLevels) {
				labelText = that.flatData.columnHeaders[0];
				labelText = getSuperLevel(labelText);
				if (labelText !== "") {
					svg.append("text")
						.attr("transform", "translate(" + (width / 2) + ", " + (height + padding.bottom) + ")")
						.style("text-anchor", "middle")
						.text(getSuperLevel(labelText));
				}
			}

			// Draw y-axis text
			svg.append("g")
				.attr("class", "y axis")
				.attr("transform", "translate(" + ((that.yAxisOrientation() == "right") ? width : -padding.left/2) + ", 0)")
				.call(yAxis)
				.selectAll("g")
				.classed("minor", function(d,i) { return i !== 0; });

			// Draw label of axis (X-axis, Y-axis)
			this.drawAxisLables(svg, padding, width, height);

			var bounds = d3.geom.polygon([[0, 0], [0, height], [width, height], [width, 0]]);

			var avgData = drawLineChart(svg, chartData, "", x, y, width, height, 3, bounds);

			// draw the 'legend' box, it usually appears in the corner (Top-Left or Top-Right of chart)
			if(this.DShowLegend()) {
				drawLegend(d3.select("#" + that.$().attr("id")));
			}

			// Calculating max and min labels
			var highestkpg = 0;
			var highestYear;
			var lowestkpg = Infinity;
			var lowestYear;

			avgData.forEach(function(d, i) {
				if (lowestkpg > d.values.avg) {
					lowestkpg = d.values.avg;
					lowestYear = d.key;
				}
				if (highestkpg < d.values.avg) {
					highestkpg = d.values.avg;
					highestYear = d.key;
				}
			});

			// Begin - Draw highest object
			var highestLabel = svg.append("g")
				.attr("class", "g-mean-text g-hide-hover")
				.attr("transform", "translate(" + x.range()[highestYear] + "," + y(highestkpg) + ")")

			highestLabel.append("text")
				.attr("class", "number")
				.attr("dy", "-10px")
				.text(format(highestkpg));

			highestLabel.append("text")
				.attr("class", "g-mean-label")
				.attr("dy", "-35px")
				.text("Highest Average");

//			if (that.swapAxes()) {
//				labelText = that.flatData.rowHeaders[highestYear];
//			} else {
				labelText = that.flatData.columnHeaders[highestYear];
//			}

			highestLabel.append("text")
				.attr("class", "g-mean-label")
				.attr("dy", "-48px")
				.text(formatYear(labelText));

			highestLabel.append("circle")
				.attr("class", "g-highlight")
				.attr("r", 5.5);
			// End - Draw highest object

			// Begin - Draw lowest object
			var lowestLabel = svg.append("g")
				.attr("class", "g-mean-text g-hide-hover")
				.attr("transform", "translate(" + x.range()[lowestYear] + "," + y(lowestkpg) + ")")

			lowestLabel.append("text")
				.attr("class", "number")
				.attr("dy", "30px")
				.text(format(lowestkpg));

			lowestLabel.append("text")
				.attr("class", "g-mean-label")
				.attr("dy", "45px")
				.text("Lowest Average");

//			if (that.swapAxes()) {
//				labelText = that.flatData.rowHeaders[lowestYear];
//			} else {
				labelText = that.flatData.columnHeaders[lowestYear];
//			}

			lowestLabel.append("text")
				.attr("class", "g-mean-label")
				.attr("dy", "60px")
				.text(formatYear(labelText));

			lowestLabel.append("circle")
				.attr("class", "g-highlight")
				.attr("r", 5.5);
			// End - Draw lowest object

			function selectTeam(code) {
				// Reset the check
				that.$().find('select').multipleSelect("setSelects", [code]);

				d3.select("#" + that.$().attr("id")).selectAll(".g-team-selected").classed("g-team-selected", false);
				if (selectedTeam = code) {
					d3.select("#" + that.$().attr("id")).selectAll("[data-team=\"" + code + "\"]").classed("g-team-selected", true);
					d3.select("#" + that.$().attr("id")).selectAll(".g-legend .g-selected-legend text").text(code);
				}
				d3.select("#" + that.$().attr("id")).selectAll(".g-team-selected path").style("stroke", that.selectedLineColor());
				d3.select("#" + that.$().attr("id")).selectAll(".g-team-selected circle").style("fill", that.selectedPointColor());
				d3.select("#" + that.$().attr("id")).selectAll(".g-team-chooser").property("value", code || "none");
				d3.select("#" + that.$().attr("id")).selectAll(".g-legend a").style("display", code? "inline-block" : "none");
			}

			function getRandomColor() {
				var letters = '0123456789ABCDEF'.split('');
				var color = '#';
				for (var i = 0; i < 6; i++ ) {
					color += letters[Math.floor(Math.random() * 16)];
				}
				return color;
			}

			// vanqm
			/*
			 * value: the key value of item (state), example: Colorado, California, DC, ...
			 * checked: this item is checked or not
			 */
			function selectItem(value, checked) {
				//longnh
				if (that.$().find('select').multipleSelect("getSelects").length)
					d3.select("#" + that.$().attr("id")).selectAll(".g-legend a").style("display", "inline-block");
				else
					d3.select("#" + that.$().attr("id")).selectAll(".g-legend a").style("display", "none");

				var color = getRandomColor();

				if (checked) {
					d3.select("#" + that.$().attr("id")).selectAll("[data-team=\"" + value + "\"]").classed("g-team-selected", true);
					d3.select("#" + that.$().attr("id")).selectAll("[data-team=\"" + value + "\"] path").style("stroke", color);
					d3.select("#" + that.$().attr("id")).selectAll(".g-team-selected circle").style("fill", that.selectedPointColor());
				} else {
					d3.select("#" + that.$().attr("id")).selectAll("[data-team=\"" + value + "\"]").classed("g-team-selected", false);
				}
			}

			function drawLegend(container, headline) {

				var legend = container.append("div")
					.attr("class", "g-legend")
					.style("opacity", that.DLegendOpacity() / 100)
					.style("left", that.DLegendLeft() + "px")
					.style("top", that.DLegendTop() + "px")
					;

				var avgLegend = legend.append("div")
					.attr("class", "g-average-legend")

				var avgSvg = avgLegend.append("svg")
					.attr("width", 24)
					.attr("height", 4)
					.append("g")
					.attr("transform", "translate(2, 2)");

				avgSvg.append("line")
					.attr("x2", 20)
					.style("stroke", that.meanLineColor());;

				avgSvg.append("circle")
					.attr("r", 2)
					.style("fill", that.meanPointColor());

				avgSvg.append("circle")
					.attr("cx", 20)
					.attr("r", 2)
					.style("fill", that.meanPointColor());

				avgLegend.append("div")
					.text(that.getYAxisLabelFromData() + " Average")
					.style("color", that.meanLineColor())

				var selectedLegend = legend.append("div")
					.attr("class", "g-selected-legend")

				var selectedSvg = selectedLegend.append("svg")
					.attr("width", 24)
					.attr("height", 4)
					.append("g")
					.attr("transform", "translate(2, 2)");

				selectedSvg.append("line")
					.attr("x2", 20)
					.style("stroke", that.selectedLineColor());

				selectedSvg.append("circle")
					.attr("r", 2)
					.style("fill", that.selectedPointColor());

				selectedSvg.append("circle")
					.attr("cx", 20)
					.attr("r", 2)
					.style("fill", that.selectedPointColor());

				var teamChooser = selectedLegend.append("select")
					.attr("class", "g-team-chooser")
					// vanqm
					.attr("multiple", "multiple")
					.style("width", that.DLegendWidth() + "px")
					.style("color", that.selectedLineColor());

				selectedLegend.append("a")
					.attr("href", "#")
					.style("display", "none")
					.text("X")
					.on("click", function() {
						d3.event.preventDefault();
						selectTeam(null);
					})

				teamChooser
					.selectAll("select")
					.data(d3.nest().key(function(d) { return d.name; })
					.sortKeys(d3.ascending).entries(chartData))
					.enter().append("option")
					.attr("value", function(d) { return d.key; })
					.text(function(d) { return getSubLevel(d.key); });

				that.$().find('select').multipleSelect({
					placeholder: "Choose a(n) " + that.getLegendLabelFromData(),
					selectAll: false,
					onClick: function(view) {
						//alert("BeatChart.js - view.value = " + view.value + ", view.checked = " + view.checked);
						//d3.selectAll("[data-team=\"" + selectedTeam + "\"]").classed("g-team-selected", false);
						selectItem(view.value, view.checked);
					}
				});
			}

			//
			// Abstracting some stuff for main line charts
			//
			function drawLineChart(container, data, attributeY, x, y, width, height, r, bounds) {
				var teamLine = d3.svg.line()
					.x(function(d) { return x.range()[d.x]; })
					.y(function(d) { return y(d.y); });

				var avgLine = d3.svg.line()
					.x(function(d) { return x.range()[d.key]; })
					.y(function(d) { return y(d.values.avg); });

				var teamData = d3.nest()
					.key(function(d) { return d.name; })
					.entries(data);

				var averageData = d3.nest()
					.key(function(d) { return d.x; })
					.rollup(function(yearobj) {
						return { "avg": d3.mean(yearobj, function(d) { return d.y; }) }
					})
					.entries(data);

				var bgCirclesContainer = container.append("g");

				bgCirclesContainer.selectAll("circle")
					.data(data)
					.enter().append("circle")
					.attr("r", r - 0.5)
					.attr("cx", function(d) { return x.range()[d.x]; })
					.attr("cy", function(d) { return y(d.y); })
					.style("fill", that.pointColor())
					;

				//  adding averages on top of main scatterplot.
				var avgContainer = container.append("g");

				avgContainer.append("path")
					.attr("class", "g-mean-line")
					.attr("d", avgLine(averageData))
					.style("stroke", that.meanLineColor())
					;

				var averages = avgContainer.selectAll(".g-mean-circle")
					.data(averageData)
					.enter().append("circle")
					.classed("g-mean-circle",true)
					.attr("cx", function(d) { return x.range()[d.key]; })
					.attr("cy", function(d) { return y(d.values.avg); })
					.attr("r", r + 0.5)
					.style("fill", that.meanPointColor())
					;

				// Team rollover lines
				var teamsContainer = container.append("g");

				var team = teamsContainer.selectAll(".g-team")
					.data(teamData)
					.enter().append("g")
					.attr("class", "g-team")
					.attr("data-team", function(d) { return d.key; });

				team.append("path")
					.attr("d", function(d) { return teamLine(d.values); })
					.style("stroke", "white")
					.style("stroke-width", 3);

				team.append("path")
					.attr("d", function(d) { return teamLine(d.values); });

				team.selectAll("circle")
					.data(function(d) { return d.values; })
					.enter().append("circle")
					.attr("r", r)
					.attr("cx", function(d) { return x.range()[d.x]; })
					.attr("cy", function(d) { return y(d.y); });

				teamsContainer.append("g")
					.attr("class", "g-overlay")
					.selectAll(".voronoi")
					.data(
						d3.geom.voronoi(
							data.map(function(d) {
								return [x.range()[d.x], y(d.y) + Math.random() - .5];
							})
						)
						/* longnh: DO NOT remove the following line of code
						 * (commented) unless you have fixed the bug. It seems
						 * to work now without this line, but not totally correct.
						 * FIXME: next .map return undefined */
						//.map(bounds.clip)
						.map(function(d, i) {
							d.path = "M" + d.join("L") + "Z";
							d.data = data[i];
							return d;
						})
					)
					.enter().append("path")
					.attr("d", function(d) { return d.path; })
					.on("mouseover", function(d, i) { selectValue(d.data); })
					.on("mouseout", function(d, i) { selectValue(null); })
					.on("click", function(d, i) { selectTeam(d.data.name); });

				var hoverLabel = teamsContainer.append("g")
					.attr("class", "g-mean-text")
					.style("display", "none");

				var hoverTeam = hoverLabel.append("text")
					.attr("dy", ".35em");

				var hoverNumber = hoverLabel.append("text")
					.attr("class", "small number")
					.attr("dy", ".35em");

				var hoverYear = hoverLabel.append("text")
					.attr("dy", ".35em");

				hoverLabel.append("circle")
					.attr("class", "g-highlight")
					.attr("r", r + 2);

				function selectValue(d) {
					if (d) {
						var offset = averageData[d.x].values.avg < d.y ? -28 : +32;
						hoverLabel.style("display", null).attr("transform", "translate(" + x.range()[d.x] + "," + y(d.y) + ")");
						hoverNumber.attr("y", offset - 12)
							.text(function() {
								if (attributeY === "twoStrikeAvg" || attributeY === "non2savg") {
									return formatBattingAverage(d.y);
								} else {
									return formatHover(d.y)
								}
							});
						hoverTeam.attr("y", offset).text(d.name);
						hoverYear.attr("y", offset + 12).text(formatYear(
							that.flatData.columnHeaders[d.x])
						);
						d3.select("#" + that.$().attr("id")).selectAll(".g-hide-hover").style("opacity", 0);
					} else {
						d3.select("#" + that.$().attr("id")).selectAll(".g-hide-hover").style("opacity", 1);
						hoverLabel.style("display", "none");
					}
				}

				return averageData;
			};

			/** Return the sub level of a header, e.g. "A | B" -> "B" */
			function getSubLevel(header, separator) {
				if (separator === undefined) {
					separator = options.dimensionSeparator.trim();
				}
				return header.slice(header.lastIndexOf(separator) + 1).trim();
			};

			/** Return the super level of a header, e.g. "A | B" -> "A" */
			function getSuperLevel(header, separator) {
				if (separator === undefined) {
					separator = options.dimensionSeparator.trim();
				}
				i = header.lastIndexOf(separator);
				if (i < 0) {
					i = 0; // the separator doesn't exist so we get nothing
				}
				return header.slice(0, i).trim();
			};

			/** automatically adjusts the root of Y-axis */
			function fixYScale(data, maxY) {
				var lowestkpg = Infinity;
				var rootY = y.domain()[0];
				var avgData = d3.nest()
					.key(function(d) { return d.x; })
					.rollup(function(yearobj) {
						return { "avg": d3.mean(yearobj, function(d) { return d.y; }) }
					})
					.entries(data);
				avgData.forEach(function(d, i) {
					if (lowestkpg > d.values.avg) {
						lowestkpg = d.values.avg;
					}
				});
				// 65 is size of average label
				var tmp = y.ticks()[1] - y.ticks()[0];
				while (y(lowestkpg) + 65 > height) {
					rootY -= tmp;
					y.domain([rootY, maxY]);
				}
			}
		};

		// get value of xAxisLabel from data
		this.getLegendLabelFromData = function() {
			var legendLabel = "";
			if(this.flatData == undefined){
				return legendLabel;
			}
			// There is difference with this.getXAxisLabelFromData()
			if(that.swapAxes()) {
				if(this.flatData.dimensionHeaders[1]) {
					legendLabel = this.flatData.dimensionHeaders[1];
				}
			} else {
				if(this.flatData.dimensionHeaders[0]) {
					legendLabel = this.flatData.dimensionHeaders[0];
				}
			}

			return legendLabel;
		}

		// get value of xAxisLabel from data
		this.getXAxisLabelFromData = function() {
			var xLabel = "xAxis Label Default";
			if(this.flatData == undefined){
				return xLabel;
			}
			if(that.swapAxes()) {
				if(this.flatData.dimensionCols[0]) {
					xLabel = this.flatData.dimensionCols[0].dimension.text;
				}
			} else {
				if(this.flatData.dimensionCols[1]) {
					xLabel = this.flatData.dimensionCols[1].dimension.text;
				}
			}

			return xLabel;
		}

		// get value of yAxisLabel from data
		this.getYAxisLabelFromData = function() {
			var yLabel = "yAxis Label Default";

			if(this.flatData == undefined){
				return yLabel;
			}
			if(that.swapAxes()) {
				if(this.flatData.dimensionRows[0]) {
					yLabel = this.flatData.dimensionRows[0].dimension.members[0].text;
				}
			} else {
				if(this.flatData.dimensionCols[0]) {
					yLabel = this.flatData.dimensionCols[0].dimension.members[0].text;
				}
			}

			return yLabel;
		}

		/*
		 * Collect all properties + new values (from data)
		 * Update these properties on property page
		 * */
		this.propertyNewValueList = function() {
			var myProps = [];
			var temp;
			temp = {
				key : "xAxisLabel",
				value : this.getXAxisLabelFromData()
			};
			myProps.push(temp);
			temp = {
				key : "yAxisLabel",
				value : this.getYAxisLabelFromData()
			};
			myProps.push(temp);

			var strJSONData = JSON.stringify(myProps);

			return strJSONData;
		}

		/*
		 * return: the selected series
		 * In City_Month_SalesRevenue, this function will return the list of city
		 * */
		this.selectedSeries = function(){
			var members = "";

			if(this.swapAxes()) {
				if(this.flatData.dimensionRows[1]) {
					members = this.flatData.dimensionRows[1].dimension.members;
				}
			} else {
				if(this.flatData.dimensionRows[0]) {
					members = this.flatData.dimensionRows[0].dimension.members;
				}
			}
			var strJSONData = JSON.stringify(members);

			return strJSONData;
		}

		/*
		 * Notify the PropertyPage.js update
		 */
		this.shouldUpdate = "0";
		this.shouldUpdatePropertyPage = function() {
//			if(this.swapAxisOld != that.swapAxes()) {
//				this.swapAxisOld = that.swapAxes();
//				return "1";
//			}
//			return "0";
			return this.shouldUpdate;
		}

		/*
		 * Draw label of axis (X-axis, Y-axis)
		 * Arguments:
		 * - container: svg tag
		 * - compPadding: the padding of component
		 * - compWidth: the width of component
		 * - compHeight: the height of component
		 * */
		this.drawAxisLables = function(container, compPadding, compWidth, compHeight) {
			if(this.swapAxisOld != that.swapAxes()) {
				this.swapAxisOld = that.swapAxes();
				// initiate the value for x-axis and y-axis
				this.xAxisLabel(this.getXAxisLabelFromData());
				this.yAxisLabel(this.getYAxisLabelFromData());
				this.shouldRefresh = "1";
			} else {
				this.shouldUpdate = "0";
			}
			// Add the text label for the x axis
			if(!this.hideXAxisLabel()) {

				if(this.xAxisLabel() == "Default x-label") {
					// try with the value be get from data
					this.xAxisLabel(this.getXAxisLabelFromData());
				}
				container.append("text")
					.attr("transform", "translate(" + (compWidth/2 + this.xAxisLabelPaddingLeft()) + " ,"
							+ (compHeight + 35 + this.xAxisLabelPaddingTop()) + ")")
					.style("text-anchor", "middle")
					.text(this.xAxisLabel());
			}

			// Add the text label for the Y axis
			if(!this.hideYAxisLabel()) {
				var xDistance = compWidth + compPadding.right;
				var myMove;
				if(this.yAxisOrientation() === "left") {
					myMove = "rotate(-90)";
					myMove = myMove + ", translate(" + (-compHeight/2 - this.yAxisLabelPaddingTop())
							+ ", " + (-compPadding.left * 2 + this.yAxisLabelPaddingLeft()) + ")";
				} else {//right
					myMove = "rotate(90)";
					myMove = myMove + ", translate(" + (compHeight/2 + this.yAxisLabelPaddingTop())
							+ ", " + (-xDistance - this.yAxisLabelPaddingLeft()) + ")";
				}

				if(this.yAxisLabel() == "Default y-label") {
					// try with the value be get from data
					this.yAxisLabel(this.getYAxisLabelFromData());
				}

				container.append("text")
					.attr("y", 0)
					.attr("x", 0)
					.attr("transform", myMove)
					.attr("dy", "1em")
					.style("text-anchor", "middle")
					.text(this.yAxisLabel());
			}

			//this.selectedSeries();
		};

		/*AUTO PROPERTIES - START*/
//		this.data = function(value) {
//			if (value === undefined) {
//				return this._data;
//			} else {
//				this._data = value;
//				return this;
//			}
//		};

		// data is City_Month_SalesRevernue
		// this property will change showing in x-dim between City vs Month
//		this.DSwapAxes = function(value) {
//			if (value === undefined) {
//				return this._DSwapAxes;
//			} else {
//				this._DSwapAxes = value;
//				return this;
//			}
//		};

		// Hide/un-hide super levels (lowest/highest)
		this.DHideSuperLevels = function(value) {
			if (value === undefined) {
				return this._DHideSuperLevels;
			} else {
				this._DHideSuperLevels = value;
				return this;
			}
		};
		/*AUTO PROPERTIES - END*/
//
//		// Check data is changed or not.
//		this.dataChanged = function() {
//			if(that.ignoreTotals_Old == undefined || that.ignoreTotals_Old != that.ignoreTotals()) {
//				return true;
//			}
//
//			if(that.oldData == undefined || JSON.stringify(that.oldData) != JSON.stringify(that.data())) {
//				return true;
//			}
//
//			return false;
//		};
//
	}

	BeatChart.prototype.constructor = BeatChart;
	BeatChart.prototype.toString = function(){
		return ownComponentName;
	}
	Component.subclass(ownComponentName, BeatChart);	// End of SDK
});

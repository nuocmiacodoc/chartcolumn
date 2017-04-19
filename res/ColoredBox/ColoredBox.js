var scn_pkg="com.gcs.ebs.bi.";
if (sap.firefly != undefined) { scn_pkg = scn_pkg.replace(".", "_"); }

define(["../../os/viz-modules/VizCore",
        "sap/designstudio/sdk/component",
        "css!./ColoredBox.css"
  ], function(VizCore, Component, jsep, css) {
    var ownComponentName = "com.gcs.ebs.bi.databound.ColoredBox";
    ColoredBox.prototype = VizCore;

    function ColoredBox() {

		var that = this;

		VizCore.call(this,{
            color : {
                opts : {
                    desc : "Color",
                    cat : "Color",
                    apsControl : "color"
                }
            }
		});

		this.init = function() {
			this.$().addClass("coloredBox");
			this.$().click(function() {
				that.fireEvent("onclick");
			});
		};

		this.afterUpdate = function() {
		    this.$().css("background-color", this.color());
		};
	};

	ColoredBox.prototype.constructor = ColoredBox;
    ColoredBox.prototype.toString = function(){
        return ownComponentName;
    }
    Component.subclass(ownComponentName, ColoredBox);
});

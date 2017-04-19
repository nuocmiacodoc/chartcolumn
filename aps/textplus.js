/**
 * Register TextField Handler
 */
define([],function(){
	sap.ui.commons.TextField.extend("com.gcs.ebs.bi.aps.TextPlus", {
		renderer : {}
	});
	return {
		id : "textplus",
		setter : function(property, value){
			this["cmp_"+property].setValue(value);
		},
		getter : function(property, control){
			return control.getValue();
		},
		createComponent : function(property, propertyOptions, changeHandler){
			var component = new com.gcs.ebs.bi.aps.TextPlus({
				value : ""
			});
			component.attachChange(changeHandler,this);
			return component;
		}
	};
});

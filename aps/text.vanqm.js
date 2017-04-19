/**
 * Register TextField Handler
 */
define([],function(){
	return {
		id : "text",
		setter : function(property, value){
			var new_value = value;
			var myProps = JSON.parse(this.callRuntimeHandler("propertyNewValueList"));
			for(var i = 0; i < myProps.length; i++) {
				if(property == myProps[i].key) {
					new_value = myProps[i].value;
					break;
				}
			}
			
			this["cmp_"+property].setValue(new_value);
		},
		getter : function(property, control){
			return control.getValue();
		},
		createComponent : function(property, propertyOptions, changeHandler){
			var component = new sap.ui.commons.TextField({
				value : ""
			});
			component.attachChange(changeHandler,this);
			return component;
		}
	};
});

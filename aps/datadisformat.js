/**
 * Dimension member text's display format
 */
var _init;
define([], function () {
    sap.ui.commons.layout.VerticalLayout.extend("com.gcs.ebs.bi.aps.DisplayFormat", {
        renderer : {},
        metadataOfDataSourceAdapter : {},
        metadata : {
            properties : {
                value : {
                    type : "object",
                    defaultValue : []
                }
            },
            events : {
                valueChange : {}
            }
        },
        notifyDataChange : function () {
            this.updateTable();
        },
        setValue : function (a) {
            this._value = a;
            this.metadataOfDataSourceAdapter = JSON.parse(propertyPage.callRuntimeHandler("getMetaData"));
            this.updateTable();
            return this;
        },
        getValue : function () {
            return this._value;
        },
        updateTable : function () {
            try {
                var metadata = this.metadataOfDataSourceAdapter;
                if (!metadata || !metadata.members) {
                    return;
                }
                var cols = [];
                var used = []; // index of used format
                this.cols = [];
                for (var i = 0; i < metadata.members.length; ++i) {
                    var _format = "";
                    var _name = "";
                    for (var j = 0; j < this._value.length; ++j) {
                        if (metadata.members[i].text === this._value[j].dimKey) {
                            _format = this._value[j].format;
                            _name = this._value[j].name;
                            used.push(j);
                            break;
                        }
                    }
                    cols.push({
                        targets : metadata.members[i].text,
                        format : _format,
                        name : _name
                    });
                }
                // Scan for unused formats
                var valChanged = false;
                for (var i = 0; i < this._value.length; ++i) {
                    var orphan = true;
                    for (var j = 0; j < used.length; ++j) {
                        if (used[j] == i)
                            orphan = false;
                    }
                    if (orphan) {
                        this._value[i] = undefined;
                        valChanged = true;
                    }
                }
                for (var i = 0; i < this._value.length; ++i) {
                    if (!this._value[i])
                        this._value.splice(i, 1);
                }
                this.cols = cols;
                this.columnModel.setData({
                    columnData : this.cols
                });
                if (valChanged)
                    this.fireValueChange();

            } catch (e) {
                alert("Error when updating column table: \n\n" + e);
            }
        },
        buildColumns : function (oControlEvent) {
            var a = [];
            for (var i = 0; i < this.cols.length; ++i) {
                if (this.cols[i].format)
                	{
                    a.push({
                        dimKey : this.cols[i].targets,
                        format : this.cols[i].format,
                        name : this.cols[i].name,
                    });
                	}
            }
            this._value = a;
            this.fireValueChange();
        },
        init : function () {
            propertyPage.registerDataComponent(this);
            this.columnTable = new sap.ui.table.Table({
                title : "Dimensions",
                visibleRowCount : 10,
                selectionMode : sap.ui.table.SelectionMode.Single
            });
            var keyColumn = new sap.ui.table.Column({
                    label : new sap.ui.commons.Label({
                    text : "Key"
                }),
                template : new sap.ui.commons.Label().bindProperty("text", "targets"),
                width : "125px"
            });
            var fileUpload = new sap.ui.unified.FileUploader({
            	change : function(e){
            		var _this = this;
                    var file = e.getParameter("files") && e.getParameter("files")[0];
                    	 
                    readData(file,setValue);
                    
                     function setValue(e)
                     {
                     _this.setAdditionalData(e.target.result);
                     _this.setValue(_this.getValue());
                     _init.buildColumns();
                     }
                     
                     function readData(file,callback)
 	            	{
 	                     var reader = new FileReader();  
 	                     var that = this;  
 	                     reader.onload = callback;
 	                     reader.readAsDataURL(file); 
 	            	 }
                      }
            });
            fileUpload.bindProperty("additionalData", "format");
            fileUpload.bindProperty("value", "name");
            //fileUpload.attachChange(this.buildColumns, this);
            _init = this;
            var textColumn = new sap.ui.table.Column({
                    label : new sap.ui.commons.Label({
                    text : "Icon Selected"
                }),
                template : fileUpload,
                sortProperty : "format",
                filterProperty : "format"
            });
            this.columnTable.addColumn(keyColumn);
            this.columnTable.addColumn(textColumn);

            this.addContent(this.columnTable);

            this.columnModel = new sap.ui.model.json.JSONModel();
            this.columnTable.setModel(this.columnModel);
            this.columnTable.bindRows("/columnData");
        },
        needsLabel : function () {
            return false;
        }
    });
    return {
        id : "datadisformat",
        setter : function (property, value) {
            var newValue = value;
            this["cmp_" + property].setValue(newValue);
        },
        getter : function (property, control) {
            return control.getValue();
        },
        createComponent : function (property, propertyOptions, changeHandler) {
            var component = new com.gcs.ebs.bi.aps.DisplayFormat({
                width : "100%",
                title : new sap.ui.commons.Title({
                    text : propertyOptions.desc
                }),
                showCollapseIcon : false
            });

            component.attachValueChange(changeHandler, this);
            return component;
        }
    };
});
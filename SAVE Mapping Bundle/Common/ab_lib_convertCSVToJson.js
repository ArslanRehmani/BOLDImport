
define(['../Common/ab_lib_fields_excluded.js'], function (fieldsExcluded) {
    String.prototype.startsWith = function (str) {
        return (this.indexOf(str) === 0);
    }
    return {
        getJsonCSV: function getJsonCSV(file) {
            var self = this;
            var fileUpload = document.getElementById("file");
            if (!file) {
                file = fileUpload.files[0];
            } else {
                file = file[0];
            }
            localStorage.setItem("UploadFileName", file.name);
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
            if (regex.test(file.name.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        // console.log('dataCSSV', data);
                        localStorage.setItem("UploadFileCSVdata", data);
                        self.csvJSON(data);
                    };
                    reader.readAsText(file);
                } else {
                    alert("This browser does not support HTML5.");
                }
            } else {
                alert("Please upload a valid CSV file.");
            }
            return false;
        },
        csvJSON: function csvJSON(csv) {
            var lines = csv.split("\r");
            var result = [];
            // NOTE: If your columns contain commas in their values, you'll need
            // to deal with those before doing the next step
            // (you might convert them to &&& or something, then covert them back later)
            // jsfiddle showing the issue https://jsfiddle.net/
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentline = lines[i].replace('\n', '').split(",");
                for (var j = 0; j < headers.length; j++) {
                    if (headers[j] && currentline[j]) {
                        obj[headers[j]] = currentline[j];
                    }
                }
                if (Object.keys(obj).length) {
                    result.push(obj);
                }
            }
            if (result.length) {
                localStorage.setItem("csvData", JSON.stringify(result));
                console.log('***result***', result);
            } else {
                alert('Selected CSV File is empty');
                jQuery('#file').val('');
                throw new Error('Selected CSV File is empty');
            }
            //return result; //JavaScript object
            return JSON.stringify(result); //JSON
        },
        getRecFields: function getRecFields(rec, recID) {
            var title = 'getRecFields()::';
            var newfields = [];
            var fieldObj = {};
            var fields, bodyfields, filteredFields = [], sublistFields = {}, items = [], excludedFieldsArray, fieldfilterObj, obj = {};
            try {
                excludedFieldsArray = fieldsExcluded.bodyFields;
                fields = rec.getFields();
                console.log('fields', fields);
                if (recID == 'bintransfer') {
                    items = rec.getSublistFields({
                        sublistId: 'inventory'
                    });
                } 
                else if (recID == 'subscription'){
                    items = rec.getSublistFields({
                        sublistId: 'subscriptionline'
                    });
                }
                else {
                    items = rec.getSublistFields({
                        sublistId: 'item'
                    });
                }

                // console.log('items', items);
                if (fields.length) {
                    filteredFields = fields.filter(function (val) {
                        for (var i = 0; i < excludedFieldsArray.length; i++) {
                            if (val.startsWith(excludedFieldsArray[i])) {
                                val = '';
                            }
                        }
                        if (val !== '') {
                            newfields.push(val);
                        }
                    });
                }
                filteredFields = []
                // console.log('items.length', items.length);
                if (items.length) {
                    for (var i = 0; i < items.length; i++) {
                        if (recID == 'bintransfer') {
                            fieldfilterObj = rec.getSublistField({
                                sublistId: 'inventory',
                                fieldId: items[i],
                                line: 0
                            });
                        } else if(recID == 'subscription') {
                            fieldfilterObj = rec.getSublistField({
                                sublistId: 'subscriptionline',
                                fieldId: items[i],
                                line: 0
                            });
                        } else {
                            fieldfilterObj = rec.getSublistField({
                                sublistId: 'item',
                                fieldId: items[i],
                                line: 0
                            });
                        }
                        if (fieldfilterObj && fieldfilterObj.label != '' && fieldfilterObj.isDisplay && !fieldfilterObj.isReadOnly) {
                            obj = {}
                            obj.id = fieldfilterObj.id;
                            obj.name = fieldfilterObj.label;
                            obj.isMandator = fieldfilterObj.isMandatory;
                            obj.isDisabled = fieldfilterObj.isDisabled;
                            obj.isDisplay = fieldfilterObj.isDisplay;
                            obj.isReadOnly = fieldfilterObj.isReadOnly;
                            obj.isVisible = fieldfilterObj.isVisible;
                            filteredFields.push(obj)
                        }
                    }
                    items = filteredFields;
                    sublistFields.item = items;
                }
                if (newfields.length) {
                    filteredFields = [];
                    for (var i = 0; i < newfields.length; i++) {
                        fieldfilterObj = rec.getField({
                            fieldId: newfields[i]
                        });
                        if (fieldfilterObj && fieldfilterObj.label != '') {
                            obj = {}
                            obj.id = newfields[i];
                            obj.name = fieldfilterObj.label;
                            obj.isMandator = fieldfilterObj.isMandatory;
                            filteredFields.push(obj)
                        }
                    }
                }
                bodyfields = filteredFields;
                fieldObj.bodyfields = bodyfields;
                fieldObj.sublistFields = sublistFields;
            } catch (error) {
                log.error(title + error.name, error.message);
            }
            return fieldObj || [];
        }
    }
});

define(['./ab_lib_fields_excluded.js'], function (fieldsExcluded) {
    String.prototype.startsWith = function (str) {
        return (this.indexOf(str) === 0);
    }
    return {
        getJsonCSV: function getJsonCSV(file) {
            // loaderDiv.style.display = "block";
            var skuArray = [];
            var columns = [];
            var self = this;
            var fileUpload = document.getElementById("file");
            if (!file) {
                file = fileUpload.files[0];
            } else {
                file = file[0];
            }
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
            if (regex.test(file.name.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        console.log('dataCSSV', data);
                        var lines = data.split("\n")
                        var csvValue = self.csvJSON(data);
                        console.log('csvValue', csvValue);
                        console.log('e.target.result', lines);
                        // jQuery.ajax({
                        //     type: "POST",
                        //     url: serverURl + "&recordType=" + window.BOLDImportRecordType,//updateQueryStringParameter(serverURl + "&parseCSV=true", 'configId', configId),
                        //     data: "fileData=" + data + "&fileName=" + file.name.toLowerCase(),
                        //     success: function (dataObj) {
                        //         // loaderDiv.style.display = "none";
                        //         jQuery('#submitter').click()
                        //     }
                        // });
                    };
                    reader.readAsText(file);
                } else {
                    // loaderDiv.style.display = "none";
                    alert("This browser does not support HTML5.");
                }
            } else {
                // loaderDiv.style.display = "none";
                alert("Please upload a valid CSV file.");
            }
            //}else{
            // alert(errorMessage);
            // }
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
            } else {
                alert('Selected CSV File is empty');
                jQuery('#file').val('');
                throw new Error('Selected CSV File is empty');
            }
            //return result; //JavaScript object
            return JSON.stringify(result); //JSON
        },
        getRecFields: function getRecFields(rec) {
            var title = 'getRecFields()::';
            log.debug(title + "rec",rec);
            var newfields = []
            var fields, filteredFields = [],sublistFields =[],items =[];
                excludedFieldsArray, fieldfilterObj,obj ={};
            try {
                excludedFieldsArray = fieldsExcluded.bodyFields;
                fields = rec.getFields();
                console.log('fields', fields);
                items = rec.getSublistFields({
                    sublistId: 'item'
                });
                console.log('items', items);
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
                if(newfields.length){
                    filteredFields =[]
                    for (var i = 0; i < newfields.length; i++) {
                        fieldfilterObj = rec.getField({
                            fieldId: newfields[i]
                        });
                        if (fieldfilterObj && fieldfilterObj.label != '') {
                            obj ={}
                            obj.id = newfields[i];
                            obj.name = fieldfilterObj.label;
                            obj.isMandator = fieldfilterObj.isMandatory;
                            filteredFields.push(obj)
                        }
                    }
                }
                // if(newfields.length){

                // }
                return filteredFields || [];
            } catch (error) {
                log.error(title + error.name, error.message);
            }

        }
    }
});
define(['N/record', '../class/createCSVFile.js', 'N/search'], function (record, createCSVLogfile, search) {
    var logError = [];
    return {
        Create: function (csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder) {
            var title = 'Create Transfer Order(::)';
            try {
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype,
                    isDynamic: true
                });
                var csvValuesDataGroupOBJ = csvValuesData[0];
                bodyFieldsLineFieldsOBJ = JSON.parse(bodyFieldsLineFieldsOBJ);
                var bodyFieldArray = bodyFieldsLineFieldsOBJ.bodyFields;

                for (var i = 0; i < bodyFieldArray.length; i++) {
                    var FieldSetObj = bodyFieldArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Subsidiary') {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid, //netsuite field id's
                            value: val // Netsuite Field Value
                        });
                        for (var j = 0; j < bodyFieldArray.length; j++) {
                            var FieldSetObj = bodyFieldArray[j];
                            var header = FieldSetObj.csvField;
                            var NSid = FieldSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            if (header == 'Subsidiary') {
                                continue;
                            }
                            if (header == 'Date') {
                                var date = new Date(val);
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid,
                                    value: date
                                });
                            } else {
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid, //netsuite field id's
                                    value: val // Netsuite Field Value
                                });
                            }
                        }
                    }
                }
                //set item sub tab data
                var lineLevelFieldArray = bodyFieldsLineFieldsOBJ.LineFields;

                for (var j = 0; j < csvValuesData.length; j++) {
                    NetsuiteRecordCreate.selectNewLine({
                        sublistId: 'item'
                    });
                    var csvValuesDataGroupOBJ = csvValuesData[j];
                    for (var k = 0; k < lineLevelFieldArray.length; k++) {
                        var LineSetObj = lineLevelFieldArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];

                        NetsuiteRecordCreate.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: NSid,
                            value: val,
                            ignoreFieldChange: true
                        });
                    }

                    NetsuiteRecordCreate.commitLine({
                        sublistId: 'item'
                    });

                }

                var recordId = NetsuiteRecordCreate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug({
                    title: 'Record create In NetSuite  ID',
                    details: recordId
                });

            } catch (error) {
                log.error(title + error.name, error.message);
                var obj = {};
                obj.id = error.name;
                obj.error = error.message;
                logError.push(obj);
            }

            if (logError && logError.length > 0) {
                log.debug({
                    title: 'LOG_ARRAY',
                    details: JSON.stringify(logError)
                });
                var properties = Object.keys(logError[0]);
                // call class that create error file
                var csvFileCreated = createCSVLogfile.createCSVFile(logError, properties, errorFileFolder);
                log.debug({
                    title: 'created and saved the log file: ',
                    details: csvFileCreated
                });
                //Most Recent Map Reduce Status Record search
                var customrecord_ab_mr_record_statusSearchObj = search.create({
                    type: "customrecord_ab_mr_record_status",
                    filters:
                        [
                            ["created", "within", "today"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "scriptid", label: "Script ID" }),
                            search.createColumn({ name: "custrecord_ab_mr_status_date", label: "Date" }),
                            search.createColumn({ name: "custrecord_ab_mr_status_mr_summary", label: "Map Reduce Summary" }),
                            search.createColumn({ name: "custrecord_ab_mr_status_csv_data_id", label: "CSV Data ID" }),
                            search.createColumn({
                                name: "created",
                                sort: search.Sort.DESC,
                                label: "Date Created"
                            })
                        ]
                });
                var results = customrecord_ab_mr_record_statusSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                var RecordID = results[0].id;
                var mapReduceRecObj = record.load({
                    type: 'customrecord_ab_mr_record_status',
                    id: parseInt(RecordID)
                });
                mapReduceRecObj.setValue({
                    fieldId: 'custrecord_ab_error_file_link',
                    value: csvFileCreated
                });
                mapReduceRecObj.save();
            }
        },
        Update: function (csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder) {
            var title = 'Update Transfer Order(::)';
            var loadrec;
            try {
                rectype = rectype.toString();
                var csvValuesDataGroupOBJ = csvValuesData[0];
                bodyFieldsLineFieldsOBJ = JSON.parse(bodyFieldsLineFieldsOBJ);
                var bodyFieldArray = bodyFieldsLineFieldsOBJ.bodyFields;
                for (var i = 0; i < bodyFieldArray.length; i++) {
                    var FieldSetObj = bodyFieldArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (NSid == 'id') {
                        log.debug({
                            title: 'NSid loadrec' + ' ' + 'NSval',
                            details: NSid + ' ' + val
                        });
                        loadrec = csvValuesDataGroupOBJ[header];
                    }
                }

                var NetsuiteRecordUpdate = record.load({
                    type: rectype,
                    id: loadrec,
                    isDynamic: true
                });

                for (var i = 0; i < bodyFieldArray.length; i++) {
                    var FieldSetObj = bodyFieldArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'To Subsidiary') {
                        NetsuiteRecordUpdate.setValue({
                            fieldId: NSid, //netsuite field id's
                            value: val // Netsuite Field Value
                        });
                        for (var j = 0; j < bodyFieldArray.length; j++) {
                            var FieldSetObj = bodyFieldArray[j];
                            var header = FieldSetObj.csvField;
                            var NSid = FieldSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            if (header == 'To Subsidiary') {
                                continue;
                            }
                            if (header == 'Date') {
                                var date = new Date(val);
                                NetsuiteRecordUpdate.setValue({
                                    fieldId: NSid,
                                    value: date
                                });
                            } else {
                                NetsuiteRecordUpdate.setValue({
                                    fieldId: NSid, //netsuite field id's
                                    value: val // Netsuite Field Value
                                });
                            }
                        }
                    }

                }
                //set item sub tab data
                var lineLevelFieldArray = bodyFieldsLineFieldsOBJ.LineFields;
                for (var j = 0; j < lineLevelFieldArray.length; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                    NetsuiteRecordUpdate.selectNewLine({
                        sublistId: 'item'
                    });
                    for (var k = 0; k < lineLevelFieldArray.length; k++) {
                        var LineSetObj = lineLevelFieldArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];

                        NetsuiteRecordUpdate.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: NSid,
                            value: val,
                            ignoreFieldChange: true
                        });
                    }
                    NetsuiteRecordUpdate.commitLine({
                        sublistId: 'item'
                    });
                }
                var recordId = NetsuiteRecordUpdate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug({
                    title: 'Record Update In NetSuite ID',
                    details: recordId
                });

            } catch (error) {
                log.error(title + error.name, error.message);
                var obj = {};
                obj.id = loadrec;
                obj.error = error.message;
                logError.push(obj);
            }
            if (logError && logError.length > 0) {
                var properties = Object.keys(logError[0]);
                // call class that create error file
                var csvFileCreated = createCSVLogfile.createCSVFile(logError, properties, errorFileFolder);
                log.debug({
                    title: 'created and saved the log file: ',
                    details: csvFileCreated
                });
                //Most Recent Map Reduce Status Record search
                var customrecord_ab_mr_record_statusSearchObj = search.create({
                    type: "customrecord_ab_mr_record_status",
                    filters:
                        [
                            ["created", "within", "today"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "scriptid", label: "Script ID" }),
                            search.createColumn({ name: "custrecord_ab_mr_status_date", label: "Date" }),
                            search.createColumn({ name: "custrecord_ab_mr_status_mr_summary", label: "Map Reduce Summary" }),
                            search.createColumn({ name: "custrecord_ab_mr_status_csv_data_id", label: "CSv Data ID" }),
                            search.createColumn({
                                name: "created",
                                sort: search.Sort.DESC,
                                label: "Date Created"
                            })
                        ]
                });
                var results = customrecord_ab_mr_record_statusSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                var RecordID = results[0].id;
                var mapReduceRecObj = record.load({
                    type: 'customrecord_ab_mr_record_status',
                    id: parseInt(RecordID)
                });
                mapReduceRecObj.setValue({
                    fieldId: 'custrecord_ab_error_file_link',
                    value: csvFileCreated
                });
                mapReduceRecObj.save();
            }
        }
    };

});
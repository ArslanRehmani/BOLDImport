define(['N/record', '../class/createCSVFile.js', 'N/search'], function (record, createCSVLogfile, search) {
    var logError = [];
    return {
        Create: function (csvValuesData, createRecordinArray, rectype, saveMappingRecID, recentlyCreateMappingRecID, errorFileFolder) {
            var title = 'intercompanyTransfer Order()::';
            try {
                log.debug({
                    title: 'Record create Function Call in intercompanyTransfer Order',
                    details: rectype
                });
                var saveMappingRecOBJ = search.lookupFields({
                    type: 'customrecord_ab_maped_record',
                    id: parseInt(saveMappingRecID),
                    columns: ['custrecord_ab_maped_record_field']
                }).custrecord_ab_maped_record_field;
                createRecordinArray = JSON.parse(createRecordinArray);
                if (createRecordinArray) {// if new fields are selected while mapping then this condition will run else saveMappingRecOBJ mean previous save obj is used

                    saveMappingRecOBJ = JSON.parse(saveMappingRecOBJ);
                    var mergedObject = {
                        "bodyFields": mergeArrays(saveMappingRecOBJ.bodyFields, createRecordinArray.bodyFields),
                        "LineFields": mergeArrays(saveMappingRecOBJ.LineFields, createRecordinArray.LineFields)
                    };
                    var NetsuiteRecordCreate = record.create({
                        type: rectype.toString(),
                        isDynamic: true
                    });
                    var csvValuesDataGroupOBJ = csvValuesData[0];
                    var bodyFieldArray = mergedObject.bodyFields;

                    for (var i = 0; i < bodyFieldArray.length; i++) {
                        var FieldSetObj = bodyFieldArray[i];
                        var header = FieldSetObj.csvField;
                        var NSid = FieldSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        if (header == 'To Subsidiary') {
                            NetsuiteRecordCreate.setValue({
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
                                    log.debug({
                                        title: 'NSid Date' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    var date = new Date(val);
                                    NetsuiteRecordCreate.setValue({
                                        fieldId: NSid,
                                        value: date
                                    });
                                } else {
                                    log.debug({
                                        title: 'NSid' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    NetsuiteRecordCreate.setValue({
                                        fieldId: NSid, //netsuite field id's
                                        value: val // Netsuite Field Value
                                    });
                                }
                            }
                        }

                    }
                    //set item sub tab data
                    var lineLevelFieldArray = mergedObject.LineFields;

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
                            log.debug({
                                title: 'LineNSid' + ' ' + 'LineNSval',
                                details: NSid + ' ' + val
                            });
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
                    // save mergedObject in recently created Save Mapping custom record
                    record.submitFields({
                        type: 'customrecord_ab_maped_record',
                        id: recentlyCreateMappingRecID,
                        values: {
                            'custrecord_ab_maped_record_field': JSON.stringify(mergedObject)
                        }
                    });
                } else {
                    log.debug({
                        title: 'saveMappingRecOBJ',
                        details: saveMappingRecOBJ
                    });
                    var NetsuiteRecordCreate = record.create({
                        type: rectype.toString(),
                        isDynamic: true
                    });
                    var csvValuesDataGroupOBJ = csvValuesData[0];
                    saveMappingRecOBJ = JSON.parse(saveMappingRecOBJ);
                    var bodyFieldArray = saveMappingRecOBJ.bodyFields;

                    for (var i = 0; i < bodyFieldArray.length; i++) {
                        var FieldSetObj = bodyFieldArray[i];
                        var header = FieldSetObj.csvField;
                        var NSid = FieldSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        if (header == 'To Subsidiary') {
                            NetsuiteRecordCreate.setValue({
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
                                    log.debug({
                                        title: 'NSid Date' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    var date = new Date(val);
                                    NetsuiteRecordCreate.setValue({
                                        fieldId: NSid,
                                        value: date
                                    });
                                } else {
                                    log.debug({
                                        title: 'NSid' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    NetsuiteRecordCreate.setValue({
                                        fieldId: NSid, //netsuite field id's
                                        value: val // Netsuite Field Value
                                    });
                                }
                            }
                        }

                    }
                    //set item sub tab data
                    var lineLevelFieldArray = saveMappingRecOBJ.LineFields;

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
                            log.debug({
                                title: 'LineNSid' + ' ' + 'LineNSval',
                                details: NSid + ' ' + val
                            });
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
                    // save saveMappingRecOBJ in recently created Save Mapping custom record
                    record.submitFields({
                        type: 'customrecord_ab_maped_record',
                        id: recentlyCreateMappingRecID,
                        values: {
                            'custrecord_ab_maped_record_field': JSON.stringify(saveMappingRecOBJ)
                        }
                    });
                }
            } catch (error) {
                log.error(title + error.name, error.message);
                var obj = {};
                obj.id = error.name;
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
                    fieldId: 'custrecord_ab_error_file_id',
                    value: csvFileCreated
                });
                mapReduceRecObj.setValue({
                    fieldId: 'custrecord_ab_error_file_link',
                    value: csvFileCreated
                });
                mapReduceRecObj.save();
            }
        },
        Update: function (csvValuesData, createRecordinArray, rectype, saveMappingRecID, recentlyCreateMappingRecID, errorFileFolder) {
            var title = 'intercompanyTransfer Order Update::';
            var loadrec;
            try {
                log.debug({
                    title: 'Record Update Function Call in intercompanyTransfer Order Update',
                    details: rectype
                });

                var saveMappingRecOBJ = search.lookupFields({
                    type: 'customrecord_ab_maped_record',
                    id: parseInt(saveMappingRecID),
                    columns: ['custrecord_ab_maped_record_field']
                }).custrecord_ab_maped_record_field;

                createRecordinArray = JSON.parse(createRecordinArray);
                if (createRecordinArray) {// if new fields are selected while mapping then this condition will run else saveMappingRecOBJ mean previous save obj is used
                    saveMappingRecOBJ = JSON.parse(saveMappingRecOBJ);
                    var mergedObject = {
                        "bodyFields": mergeArrays(saveMappingRecOBJ.bodyFields, createRecordinArray.bodyFields),
                        "LineFields": mergeArrays(saveMappingRecOBJ.LineFields, createRecordinArray.LineFields)
                    };
                    var csvValuesDataGroupOBJ = csvValuesData[0];
                    var bodyFieldArray = mergedObject.bodyFields;
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
                        type: rectype.toString(),
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
                                    log.debug({
                                        title: 'NSid Date' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    var date = new Date(val);
                                    NetsuiteRecordUpdate.setValue({
                                        fieldId: NSid,
                                        value: date
                                    });
                                } else {
                                    log.debug({
                                        title: 'NSid' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    NetsuiteRecordUpdate.setValue({
                                        fieldId: NSid, //netsuite field id's
                                        value: val // Netsuite Field Value
                                    });
                                }
                            }
                        }

                    }
                    //set item sub tab data
                    var lineLevelFieldArray = mergedObject.LineFields;
                    // var jsonLinelevelArray = JSON.parse(LineLevelData);
                    for (var j = 0; j < lineLevelFieldArray.length; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                        NetsuiteRecordUpdate.selectNewLine({
                            sublistId: 'item'
                        });
                        for (var k = 0; k < lineLevelFieldArray.length; k++) {
                            var LineSetObj = lineLevelFieldArray[k];
                            var header = LineSetObj.csvField;
                            var NSid = LineSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            log.debug({
                                title: 'LineNSid' + ' ' + 'LineNSval',
                                details: NSid + ' ' + val
                            });
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
                    // save mergedObject in recently created Save Mapping custom record
                    record.submitFields({
                        type: 'customrecord_ab_maped_record',
                        id: recentlyCreateMappingRecID,
                        values: {
                            'custrecord_ab_maped_record_field': JSON.stringify(mergedObject)
                        }
                    });
                } else {
                    var csvValuesDataGroupOBJ = csvValuesData[0];
                    saveMappingRecOBJ = JSON.parse(saveMappingRecOBJ);
                    var bodyFieldArray = saveMappingRecOBJ.bodyFields;
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
                        type: rectype.toString(),
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
                                    log.debug({
                                        title: 'NSid Date' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    var date = new Date(val);
                                    NetsuiteRecordUpdate.setValue({
                                        fieldId: NSid,
                                        value: date
                                    });
                                } else {
                                    log.debug({
                                        title: 'NSid' + ' ' + 'NSval',
                                        details: NSid + ' ' + val
                                    });
                                    NetsuiteRecordUpdate.setValue({
                                        fieldId: NSid, //netsuite field id's
                                        value: val // Netsuite Field Value
                                    });
                                }
                            }
                        }

                    }
                    //set item sub tab data
                    var lineLevelFieldArray = saveMappingRecOBJ.LineFields;
                    // var jsonLinelevelArray = JSON.parse(LineLevelData);
                    for (var j = 0; j < lineLevelFieldArray.length; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                        NetsuiteRecordUpdate.selectNewLine({
                            sublistId: 'item'
                        });
                        for (var k = 0; k < lineLevelFieldArray.length; k++) {
                            var LineSetObj = lineLevelFieldArray[k];
                            var header = LineSetObj.csvField;
                            var NSid = LineSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            log.debug({
                                title: 'LineNSid' + ' ' + 'LineNSval',
                                details: NSid + ' ' + val
                            });
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
                    // save mergedObject in recently created Save Mapping custom record
                    record.submitFields({
                        type: 'customrecord_ab_maped_record',
                        id: recentlyCreateMappingRecID,
                        values: {
                            'custrecord_ab_maped_record_field': JSON.stringify(saveMappingRecOBJ)
                        }
                    });
                }

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
                    fieldId: 'custrecord_ab_error_file_id',
                    value: csvFileCreated
                });
                mapReduceRecObj.setValue({
                    fieldId: 'custrecord_ab_error_file_link',
                    value: csvFileCreated
                });
                mapReduceRecObj.save();
            }
        }

    };
    function mergeArrays(arr1, arr2) {
        var mergedArr = [];

        for (var i = 0; i < arr1.length; i++) {
            mergedArr.push(arr1[i]);
        }

        for (var j = 0; j < arr2.length; j++) {
            mergedArr.push(arr2[j]);
        }

        return mergedArr;
    }

});
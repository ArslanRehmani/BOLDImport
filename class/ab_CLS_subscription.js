define(['N/record', '../class/createCSVFile.js', 'N/search'], function (record, createCSVLogfile, search) {
    var logError = [];
    return {
        Create: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'subscription()::';
            try {
                log.debug({
                    title: 'Record create Function Call in subscription',
                    details: rectype
                });
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype
                    // isDynamic: true
                });
                var csvValuesDataGroupOBJ = csvValuesData[0];
                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Customer') {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid, //netsuite field id's
                            value: parseInt(val),
                            ignoreFieldChange: false,
                            forceSyncSourcing: true
                        });
                        for (var j = 0; j < createRecordinArray.length; j++) {
                            var FieldSetObj = createRecordinArray[j];
                            var header = FieldSetObj.csvField;
                            var NSid = FieldSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            if (header == 'Customer') {
                                continue;
                            }
                            if (header == 'Date') {
                                log.debug({
                                    title: 'NSid' + ' ' + 'NSval',
                                    details: NSid + ' ' + val
                                });
                                var date = new Date(val);
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid,
                                    value: date,
                                    ignoreFieldChange: false
                                });
                            } else if (header == 'Auto') {
                                log.debug({
                                    title: 'NSid' + ' ' + 'NSval',
                                    details: NSid + ' ' + val
                                });
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid, //netsuite field id's
                                    value: true, // Netsuite Field Value
                                    ignoreFieldChange: false
                                });
                            } else {
                                log.debug({
                                    title: 'NSid' + ' ' + 'NSval',
                                    details: NSid + ' ' + val
                                });
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid, //netsuite field id's
                                    value: val,
                                    ignoreFieldChange: false // Netsuite Field Value
                                });
                            }

                        }
                    }
                }
                var lines = NetsuiteRecordCreate.getLineCount({
                    sublistId: 'subscriptionline'
                });
                log.debug('lines', lines);
                //set subscriptionline sub tab data
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                for (var j = 0; j < lines; j++) {
                    NetsuiteRecordCreate.selectLine({
                        sublistId: 'subscriptionline',
                        line: 0
                    });
                    NetsuiteRecordCreate.setCurrentSublistValue({
                        sublistId: 'subscriptionline',
                        fieldId: 'isincluded',
                        value: true,
                        ignoreFieldChange: true
                    });
                    NetsuiteRecordCreate.setCurrentSublistValue({
                        sublistId: 'subscriptionline',
                        fieldId: 'status',
                        value: 'PENDING_ACTIVATION',
                        ignoreFieldChange: true
                    });
                    // var csvValuesDataGroupOBJ = csvValuesData[j];
                    // for (var k = 0; k < jsonLinelevelArray.length; k++) {
                    //     var LineSetObj = jsonLinelevelArray[k];
                    //     var header = LineSetObj.csvField;
                    //     var NSid = LineSetObj.NSField;
                    //     var val = csvValuesDataGroupOBJ[header];
                    //     log.debug({
                    //         title: 'LineNSid' + ' ' + 'LineNSval',
                    //         details: NSid + ' ' + val
                    //     });

                    //     NetsuiteRecordCreate.setCurrentSublistValue({
                    //         sublistId: 'subscriptionline',
                    //         fieldId: NSid,
                    //         value: val,
                    //         ignoreFieldChange: true
                    //     });
                    // }
                    NetsuiteRecordCreate.commitLine({
                        sublistId: 'subscriptionline'
                    });
                }

                var recordId = NetsuiteRecordCreate.save();
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
            log.debug({
                title: 'logErrorUPDATE',
                details: logError
            });
            if (logError && logError.length > 0) {
                log.debug({
                    title: 'LOG_ARRAY',
                    details: JSON.stringify(logError)
                });
                var properties = Object.keys(logError[0]);
                log.debug({
                    title: 'properties',
                    details: JSON.stringify(properties)
                });
                // call class that create error file
                var csvFileCreated = createCSVLogfile.createCSVFile(logError, properties);
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
                            search.createColumn({ name: "custrecord_ab_mr_status_csv_data_id", label: "CSD Data ID" }),
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
                mapReduceRecObj.save();
            }
        },
        Update: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'subscription() Update::';
            var loadrec;
            try {
                log.debug({
                    title: 'Record Update Function Call in subscription Update',
                    details: rectype
                });
                rectype = rectype.toString();
                var csvValuesDataGroupOBJ = csvValuesData[0];
                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (NSid == 'id') {
                        log.debug({
                            title: 'NSid' + ' ' + 'NSval',
                            details: NSid + ' ' + val
                        });
                        loadrec = csvValuesDataGroupOBJ[header];
                    }
                }
                var NetsuiteRecordCreate = record.load({
                    type: rectype,
                    id: parseInt(loadrec)
                    // isDynamic: true
                });
                // for (var i = 0; i < createRecordinArray.length; i++) {
                //     var FieldSetObj = createRecordinArray[i];
                //     var header = FieldSetObj.csvField;
                //     var NSid = FieldSetObj.NSField;
                //     var val = csvValuesDataGroupOBJ[header];
                //     if (header == 'Date') {
                //         var date = new Date(val);
                //         NetsuiteRecordCreate.setValue({
                //             fieldId: NSid,
                //             value: date
                //         });
                //     } else {
                //         NetsuiteRecordCreate.setValue({
                //             fieldId: NSid, //netsuite field id's
                //             value: val // Netsuite Field Value
                //         });
                //     }
                // }
                //set subscriptionline sub tab data
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                    for (var k = 0; k < jsonLinelevelArray.length; k++) {
                        var LineSetObj = jsonLinelevelArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        log.debug({
                            title: 'LineNSid' + ' ' + 'LineNSval',
                            details: NSid + ' ' + val
                        });
                        log.debug({
                            title: 'Line Header',
                            details: header
                        });
                        if(NSid == 'status'){
                            NetsuiteRecordCreate.setSublistValue({
                                sublistId: 'subscriptionline',
                                fieldId: NSid,
                                // value: val,
                                value: 'PENDING_ACTIVATION',
                                line: 0,
                                ignoreFieldChange: true
                            });
                        }
                    }
                var recordId = NetsuiteRecordCreate.save();
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
            log.debug({
                title: 'logErrorUPDATE',
                details: logError
            });
            if (logError && logError.length > 0) {
                log.debug({
                    title: 'LOG_ARRAY',
                    details: JSON.stringify(logError)
                });
                var properties = Object.keys(logError[0]);
                log.debug({
                    title: 'properties',
                    details: JSON.stringify(properties)
                });
                // call class that create error file
                var csvFileCreated = createCSVLogfile.createCSVFile(logError, properties);
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
                            search.createColumn({ name: "custrecord_ab_mr_status_csv_data_id", label: "CSD Data ID" }),
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
                mapReduceRecObj.save();
            }
        }
    };

});
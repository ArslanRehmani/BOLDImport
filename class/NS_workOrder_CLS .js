define(['N/record', '../class/createCSVFile.js'], function (record, createCSVLogfile) {
    var logError = [];
    return {
        Create: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'WorkOrder()::';
            try {
                log.debug({
                    title: 'Record create Function Call in Work Order',
                    details: rectype
                });
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype,
                    isDynamic: true
                });
                var csvValuesDataGroupOBJ = csvValuesData[0];
                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    log.debug({
                        title: 'FieldSetObj',
                        details: FieldSetObj
                    });
                    log.debug({
                        title: 'csvValuesDataGroupOBJ',
                        details: csvValuesDataGroupOBJ
                    });
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Subsidiary') {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid, //netsuite field id's
                            value: val // Netsuite Field Value
                        });
                        for (var j = 0; j < createRecordinArray.length; j++) {
                            var FieldSetObj = createRecordinArray[j];
                            var header = FieldSetObj.csvField;
                            var NSid = FieldSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            if(header == 'Subsidiary'){
                                continue;
                            }
                            if (header == 'date') {
                                log.debug({
                                    title: 'NSid' + ' ' + 'NSval',
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
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                if(jsonLinelevelArray && jsonLinelevelArray.length){
                    for (var j = 0; j < csvValuesData.length; j++) {
                        NetsuiteRecordCreate.selectNewLine({
                            sublistId: 'item'
                        });
                        var csvValuesDataGroupOBJ = csvValuesData[j];
                        for (var k = 0; k < jsonLinelevelArray.length; k++) {
                            var LineSetObj = jsonLinelevelArray[k];
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
                    value: 'https://tstdrv2084962.app.netsuite.com/app/common/media/mediaitem.nl?id='+csvFileCreated+'&e=T'
                });
                mapReduceRecObj.save();
            }
        },
        Update: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'WorkOrder() Update::';
            var loadrec;
            try {
                log.debug({
                    title: 'Record Update Function Call in Work Order Update',
                    details: rectype
                });
                rectype = rectype.toString();
                var csvValuesDataGroupOBJ = csvValuesData[0];
                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    // var val = csvValuesData[header];
                    var val = csvValuesDataGroupOBJ[header];
                    if (NSid == 'id') {
                        // loadrec = csvValuesData[header];
                        loadrec = csvValuesDataGroupOBJ[header];
                    }
                }
                var NetsuiteRecordCreate = record.load({
                    type: rectype,
                    id: loadrec,
                    isDynamic: true
                });
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    // var val = csvValuesData[header];
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Subsidiary') {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid, //netsuite field id's
                            value: val // Netsuite Field Value
                        });
                        for (var j = 0; j < createRecordinArray.length; j++) {
                            var FieldSetObj = createRecordinArray[j];
                            var header = FieldSetObj.csvField;
                            var NSid = FieldSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            if(header == 'Subsidiary'){
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
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                if(jsonLinelevelArray && jsonLinelevelArray.length){
                    for (var j = 0; j < 2; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                        NetsuiteRecordCreate.selectNewLine({
                            sublistId: 'item'
                        });
                        for (var k = 0; k < jsonLinelevelArray.length; k++) {
                            var LineSetObj = jsonLinelevelArray[k];
                            var header = LineSetObj.csvField;
                            var NSid = LineSetObj.NSField;
                            // var val = csvValuesData[header];
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
                }
                var recordId = NetsuiteRecordCreate.save({
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
                    value: 'https://tstdrv2084962.app.netsuite.com/app/common/media/mediaitem.nl?id='+csvFileCreated+'&e=T'
                });
                mapReduceRecObj.save();
            }
        }
    };

});
define(['N/record', '../class/createCSVFile.js'], function (record, createCSVLogfile) {
    var logError = [];
    return {
        Create: function (csvValuesData, finalArray, createRecordinArray, rectype, LineLevelData) {
            var title = 'SalesOrder()::';
            try {
                log.debug({
                    title: 'Record create Function Call in Sales Order',
                    details: rectype
                });
                log.debug({
                    title: 'LineLevelData in Sales Order Class',
                    details: LineLevelData
                });
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype,
                    isDynamic: true
                });

                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesData[header];
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
                //set item sub tab data
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                log.debug({
                    title: 'jsonLinelevelArray',
                    details: jsonLinelevelArray
                });
                for (var j = 0; j < 1; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                    NetsuiteRecordCreate.selectNewLine({
                        sublistId: 'item'
                    });
                    for (var k = 0; k < jsonLinelevelArray.length; k++) {
                        var LineSetObj = jsonLinelevelArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesData[header];
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

            } catch (error) {
                log.error(title + error.name, error.message);
            }
        },
        Update: function (csvValuesData, finalArray, createRecordinArray, rectype, LineLevelData) {
            var title = 'SalesOrder() Update::';
            try {
                log.debug({
                    title: 'Record create Function Call in Sales Order Update',
                    details: rectype
                });
                rectype = rectype.toString();

                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesData[header];
                    if (NSid == 'id') {
                        loadrec = csvValuesData[header];
                        log.debug({
                            title: 'loadrec',
                            details: loadrec
                        });
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
                    log.debug({
                        title: 'header***',
                        details: header
                    });
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesData[header];
                    if (header == 'date') {
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
                //set item sub tab data
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                log.debug({
                    title: 'jsonLinelevelArray',
                    details: jsonLinelevelArray
                });
                for (var j = 0; j < 1; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                    NetsuiteRecordCreate.selectNewLine({
                        sublistId: 'item'
                    });
                    for (var k = 0; k < jsonLinelevelArray.length; k++) {
                        var LineSetObj = jsonLinelevelArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesData[header];
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
            if (logErrorArray && logErrorArray.length > 0) {
                log.debug({
                    title: 'LOG_ARRAY',
                    details: JSON.stringify(logErrorArray)
                });
                var properties = Object.keys(logErrorArray[0]);
                log.debug({
                    title: 'properties',
                    details: JSON.stringify(properties)
                });
                // call class that create error file
                var csvFileCreated = createCSVLogfile.createCSVFile(logErrorArray, properties);
                createCSVLogfile.createCSVFile(logErrorArray, properties);
                log.debug({
                    title: 'created and saved the log file: ',
                    details: csvFileCreated
                });
                // NAScriptedCSVImportjq.NAScriptedCSVImportJQ.upsert({
                //     id: QUEUE_RECORD_ID,
                //     processnote: 'Execution completed with errors. See Log File.',
                //     processlogfile: csvFileCreated,
                //     processstatus: 'Queue'
                // });
            }
        }
    };

});
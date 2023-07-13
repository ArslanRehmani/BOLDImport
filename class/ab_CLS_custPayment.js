define(['N/record', '../class/createCSVFile.js'], function (record, createCSVLogfile) {
    var logError = [];
    return {
        Create: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'customerPaymentCreate()::';
            try {
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype
                });
                var csvValuesDataGroupOBJ = csvValuesData[0];
                createRecordinArray = JSON.parse(createRecordinArray);
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    // var val = csvValuesData[header];
                    var val = csvValuesDataGroupOBJ[header];
                    log.audit({
                        title: 'NSID' + 'val',
                        details: NSid + val
                    });
                    if (NSid == 'customer') {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid,
                            value: val,
                            forceSyncSourcing: true
                        });
                    }
                   else if (header == 'Date') {
                        var date = new Date(val);
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid,
                            value: date
                        });
                    }     
                    else {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid,//netsuite field id's
                            value: val // Netsuite Field Value
                        });
                    }

                }
                var count = NetsuiteRecordCreate.getLineCount({
                    sublistId: 'apply'
                });
                for(var i=0; i<count; i++){
                    NetsuiteRecordCreate.setSublistValue({
                        sublistId : 'apply',
                        fieldId : 'apply',
                        value : 'T',
                        line : i,
                        forceSyncSourcing: true
                    });
                }
                var recordId = NetsuiteRecordCreate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug({
                    title: 'Record create In NetSuite  ID',
                    details: recordId
                })

            } catch (error) {
                log.error(title + error.name, error.message);
            }
        },
        Update: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'customerPayment() Update::';
            var loadrec;
            try {
                rectype = rectype.toString();
                createRecordinArray = JSON.parse(createRecordinArray);
                var csvValuesDataGroupOBJ = csvValuesData[0];
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (NSid == 'id') {
                        loadrec = csvValuesDataGroupOBJ[header];
                    }
                }
                var NetsuiteRecordCreate = record.load({
                    type: rectype,
                    id: parseInt(loadrec),
                    isDynamic: true
                });
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Date') {
                        var date = new Date(val);
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid,
                            value: date
                        });
                    } else {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid,//netsuite field id's
                            value: val // Netsuite Field Value
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
                createCSVLogfile.createCSVFile(logError, properties);
                log.debug({
                    title: 'created and saved the log file: ',
                    details: csvFileCreated
                });
            }
        }

    };
});
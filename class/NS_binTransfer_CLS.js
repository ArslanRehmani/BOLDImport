define(['N/record', '../class/createCSVFile.js'], function (record, createCSVLogfile) {
    var logError = [];
    return {
        Create: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'binTransfer()::';
            try {
                log.debug({
                    title: 'Record create Function Call in binTransfer',
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
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
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
                //set item sub tab data
                var newArr = [];
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                for (var j = 0; j < csvValuesData.length; j++) {
                    NetsuiteRecordCreate.selectNewLine({
                        sublistId: 'inventory'
                    });
                    var csvValuesDataGroupOBJ = csvValuesData[j];
                    for (var k = 0; k < jsonLinelevelArray.length; k++) {
                        var LineSetObj = jsonLinelevelArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        log.debug({
                            title: 'Line NSid' + ' ' + 'Line NSval',
                            details: NSid + ' ' + val
                        });
                        if (NSid == 'inventorydetail') {
                            // var data = JSON.parse(val);
                            val = val.replace(/\|/g, ",");
                            log.debug({
                                title: 'val',
                                details: val
                            });

                            // log.debug('Arraytype',typeof(val));
                            log.debug('Array Parse', typeof (val));
                            var string = val.replace(/'/gi, '"');
                            log.debug('string', string);
                            log.debug('string typeof', typeof string);
                            // var ObjString = JSON.stringify(string);
                            // if(ObjString.includes("@") == true){
                            //    newArr = string.split('@');
                            // }else{
                            //     newArr = string;
                            // }
                            newArr = string.split('@');
                            log.debug('newArr', newArr);
                            log.debug('newArr.length', newArr.length);
                            
                            for (var n = 0; n < newArr.length; n++) {
                                var invDetailArray = JSON.parse(newArr[n]);
                                log.debug('invDetailArray', invDetailArray);
                                var inventoryDetailRecord = NetsuiteRecordCreate.getCurrentSublistSubrecord({
                                    sublistId: 'inventory',
                                    fieldId: 'inventorydetail'
                                });
                                inventoryDetailRecord.selectNewLine({
                                    sublistId: 'inventoryassignment'
                                });
                                inventoryDetailRecord.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'binnumber',
                                    value: parseInt(invDetailArray.fromId),
                                    ignoreFieldChange: true
                                });
                                inventoryDetailRecord.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'tobinnumber',
                                    value: parseInt(invDetailArray.toId),
                                    ignoreFieldChange: true
                                });
                                inventoryDetailRecord.setCurrentSublistValue({
                                    sublistId: 'inventoryassignment',
                                    fieldId: 'quantity',
                                    value: parseInt(invDetailArray.qty),
                                    ignoreFieldChange: true
                                });
                                inventoryDetailRecord.commitLine({
                                    sublistId: 'inventoryassignment'
                                });
                            }
                        } else {
                            NetsuiteRecordCreate.setCurrentSublistValue({
                                sublistId: 'inventory',
                                fieldId: NSid,//item
                                value: val,
                                ignoreFieldChange: false
                            });
                        }
                    }
                    NetsuiteRecordCreate.commitLine({
                        sublistId: 'inventory'
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
        Update: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'binTransfer Update::';
            var loadrec;
            try {
                log.debug({
                    title: 'Record Update Function Call in binTransfer Update',
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
                    var val = csvValuesData[header];
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
                //set item sub tab data
                var jsonLinelevelArray = JSON.parse(LineLevelData);
                for (var j = 0; j < csvValuesData.length; j++) { //This loop is for num of lines need to enter in Sales order **Need to be Dynamic**
                    NetsuiteRecordCreate.selectNewLine({
                        sublistId: 'inventory'
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
                            sublistId: 'inventory',
                            fieldId: NSid,
                            value: val,
                            ignoreFieldChange: true
                        });
                    }
                    NetsuiteRecordCreate.commitLine({
                        sublistId: 'inventory'
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
            }
        }
    };

});
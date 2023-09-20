define(['N/record', '../class/createCSVFile.js', 'N/search'], function (record, createCSVLogfile, search) {
    var logError = [];
    return {
        Create: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'charge Order()::';
            try {
                log.debug({
                    title: 'Record create Function Call in charge Order',
                    details: rectype
                });
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype,
                    isDynamic: true
                });
                var csvValuesDataGroupOBJ = csvValuesData[0];
                createRecordinArray = JSON.parse(createRecordinArray);
                var bodyFieldArray = createRecordinArray.bodyFields;
                log.debug({
                    title: 'bodyFieldArray in Class ###',
                    details: bodyFieldArray
                });
                for (var i = 0; i < bodyFieldArray.length; i++) {
                    var FieldSetObj = bodyFieldArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Customer') {
                        NetsuiteRecordCreate.setValue({
                            fieldId: NSid, //netsuite field id's
                            value: val, // Netsuite Field Value
                            ignoreFieldChange: true
                        });
                        for (var j = 0; j < bodyFieldArray.length; j++) {
                            var FieldSetObj = bodyFieldArray[j];
                            var header = FieldSetObj.csvField;
                            var NSid = FieldSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            if (header == 'Customer') {
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
                            }
                            else if (header == 'Service Start Date') {
                                log.debug({
                                    title: 'NSid Service' + ' ' + 'NSval',
                                    details: NSid + ' ' + val
                                });
                                var date = new Date(val);
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid,
                                    value: date
                                });
                            }
                            else {
                                log.debug({
                                    title: 'NSid' + ' ' + 'NSval',
                                    details: NSid + ' ' + val
                                });
                                NetsuiteRecordCreate.setValue({
                                    fieldId: NSid, //netsuite field id's
                                    value: val, // Netsuite Field Value
                                    ignoreFieldChange: true
                                });
                            }
                        }
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
                    value: 'https://tstdrv2084962.app.netsuite.com/app/common/media/mediaitem.nl?id=' + csvFileCreated + '&e=T'
                });
                mapReduceRecObj.save();
            }
        },
        Update: function (csvValuesData, createRecordinArray, rectype, LineLevelData) {
            var title = 'charge Order Update::';
            var loadrec;
            try {
                log.debug({
                    title: 'Record Update Function Call in charge Order Update',
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
                            title: 'NSid loadrec' + ' ' + 'NSval',
                            details: NSid + ' ' + val
                        });
                        loadrec = csvValuesDataGroupOBJ[header];
                    }
                }
                log.debug({
                    title: 'loadrec Outside',
                    details: loadrec
                });
                var NetsuiteRecordUpdate = record.load({
                    type: rectype,
                    id: loadrec,
                    isDynamic: true
                });
                for (var i = 0; i < createRecordinArray.length; i++) {
                    var FieldSetObj = createRecordinArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    if (header == 'Date' || header == 'Service Start Date') {
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
                    value: 'https://tstdrv2084962.app.netsuite.com/app/common/media/mediaitem.nl?id=' + csvFileCreated + '&e=T'
                });
                mapReduceRecObj.save();
            }
        }
    };

});
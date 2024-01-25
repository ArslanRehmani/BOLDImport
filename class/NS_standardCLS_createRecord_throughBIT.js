define(['N/record', '../class/createCSVFile.js', 'N/search'], function (record, createCSVLogfile, search) {
    var logError = [];
    return {
        Create: function (csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder) {
            var title = 'NS Standard Class to create record(::)';
            try {
                rectype = rectype.toString();
                var NetsuiteRecordCreate = record.create({
                    type: rectype,
                    isDynamic: true
                });
                var csvValuesDataGroupOBJ = csvValuesData[0];
                bodyFieldsLineFieldsOBJ = JSON.parse(bodyFieldsLineFieldsOBJ);
                log.debug({
                    title: 'bodyFieldsLineFieldsOBJ in standard class',
                    details: bodyFieldsLineFieldsOBJ
                });
                var bodyFieldArray = bodyFieldsLineFieldsOBJ.bodyFields;

                for (var i = 0; i < bodyFieldArray.length; i++) {
                    var FieldSetObj = bodyFieldArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    var containsDate = /date/i.test(header); // The 'i' flag makes it case-insensitive
                    if (containsDate) {
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
                var lineLevelFieldArray = bodyFieldsLineFieldsOBJ.LineFields;
                if (lineLevelFieldArray && lineLevelFieldArray.length) {
                    setLineLevelInfo(rectype, NetsuiteRecordCreate, csvValuesData, lineLevelFieldArray);
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
            var title = 'NS Standard Class to update record(::)';
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
                    id: loadrec
                    // isDynamic: true
                });

                for (var i = 0; i < bodyFieldArray.length; i++) {
                    var FieldSetObj = bodyFieldArray[i];
                    var header = FieldSetObj.csvField;
                    var NSid = FieldSetObj.NSField;
                    var val = csvValuesDataGroupOBJ[header];
                    var containsDate = /date/i.test(header); // The 'i' flag makes it case-insensitive
                    if (containsDate) {
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
                //set item sub tab data
                var lineLevelFieldArray = bodyFieldsLineFieldsOBJ.LineFields;
                if (lineLevelFieldArray && lineLevelFieldArray.length) {
                    setLineLevelInfoUpdate(rectype, loadrec, NetsuiteRecordUpdate, csvValuesData, lineLevelFieldArray);
                }else{
                    var recordId = NetsuiteRecordUpdate.save({
                        enableSourcing: true,
                        ignoreMandatoryFields: true
                    });
                    log.debug({
                        title: 'Record Update In NetSuite ID',
                        details: recordId
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
                    fieldId: 'custrecord_ab_error_file_link',
                    value: csvFileCreated
                });
                mapReduceRecObj.save();
            }
        }
    };
    function setLineLevelInfo(rectype, NetsuiteRecordCreate, csvValuesData, lineLevelFieldArray) {
        var title = 'setLineLevelInfo(::)';
        try {
            if (rectype == 'bintransfer') {
                lineLevelFieldArray = sortBinTransferInvDetail(lineLevelFieldArray);
                for (var j = 0; j < csvValuesData.length; j++) {
                    var csvValuesDataGroupOBJ = csvValuesData[j];
                    for (var k = 0; k < lineLevelFieldArray.length; k++) {
                        var LineSetObj = lineLevelFieldArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        if (NSid == 'item') {
                            var isLOTItem = searchLotItem(val);
                            if (isLOTItem == 'true' || isLOTItem == true) {
                                setLotAssemblyInvDetail(NetsuiteRecordCreate, lineLevelFieldArray, csvValuesDataGroupOBJ);
                            } else if (isLOTItem == 'false' || isLOTItem == false) {
                                setInventoryInvDetail(NetsuiteRecordCreate, lineLevelFieldArray, csvValuesDataGroupOBJ);
                            }
                        }
                    }
                }
            } else {
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
            }
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
    }
    function setLineLevelInfoUpdate(rectype, loadrec, NetsuiteRecordUpdate, csvValuesData, lineLevelFieldArray) {
        var title = 'setLineLevelInfoUpdate(::)';
        try {
            if (rectype == 'bintransfer') {
                lineLevelFieldArray = sortBinTransferInvDetail(lineLevelFieldArray);
                var obj;
                var newArray = [];
                var newLineAddArray = [];
                for (var j = 0; j < csvValuesData.length; j++) {
                    var csvValuesDataGroupOBJ = csvValuesData[j];
                    for (var k = 0; k < lineLevelFieldArray.length; k++) {
                        obj = {};
                        var lineNumber;
                        var LineSetObj = lineLevelFieldArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        if (NSid == 'item') {
                            lineNumber = NetsuiteRecordUpdate.findSublistLineWithValue({
                                sublistId: 'inventory',
                                fieldId: 'item',
                                value: val
                            });
                            if (lineNumber != -1) {
                                obj.lineNum = lineNumber;
                                obj.item = val;
                                newArray.push(obj);
                                NetsuiteRecordUpdate.removeLine({
                                    sublistId: 'inventory',
                                    line: parseInt(lineNumber),
                                    ignoreRecalc: true
                                });
                            }else{
                                newLineAddArray.push(csvValuesDataGroupOBJ);
                            }
                        }
                    }
                }
                NetsuiteRecordUpdate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                var NetsuiteRecordUpdateAgain = record.load({
                    type: rectype,
                    id: loadrec,
                    isDynamic: true
                });
                if(newArray && newArray.length){
                    for (var p = 0; p < newArray.length; p++) {
                        var csvValuesDataGroupOBJ = csvValuesData[p];
                        var isLOTItem = searchLotItem(newArray[p].item);
                        if (isLOTItem == 'true' || isLOTItem == true) {
                            setLotAssemblyInvDetail(NetsuiteRecordUpdateAgain, lineLevelFieldArray, csvValuesDataGroupOBJ);
                        } else if (isLOTItem == 'false' || isLOTItem == false) {
                            setInventoryInvDetail(NetsuiteRecordUpdateAgain, lineLevelFieldArray, csvValuesDataGroupOBJ);
                        }
                    }
                }
                if(newLineAddArray && newLineAddArray.length){
                    for (var q = 0; q < newLineAddArray.length; q++) {
                        var csvValuesOBJ = newLineAddArray[q];//
                        var isLOTItem = searchLotItem(csvValuesOBJ.item);
                        if (isLOTItem == 'true' || isLOTItem == true) {
                            setLotAssemblyInvDetail(NetsuiteRecordUpdateAgain, lineLevelFieldArray, csvValuesOBJ);
                        } else if (isLOTItem == 'false' || isLOTItem == false) {
                            setInventoryInvDetail(NetsuiteRecordUpdateAgain, lineLevelFieldArray, csvValuesOBJ);
                        }
                    }
                }
                var recordId = NetsuiteRecordUpdateAgain.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                log.debug({
                    title: 'Record Update In NetSuite ID',
                    details: recordId
                });
            } else {
                log.debug({
                    title: 'lineLevelFieldArray UPDATE Line',
                    details: lineLevelFieldArray
                });
                log.debug({
                    title: 'csvValuesData UPDATE Line',
                    details: csvValuesData
                });
                var obj;
                var newArray = [];
                var newLineAddArray = [];
                for (var j = 0; j < csvValuesData.length; j++) {
                    var csvValuesDataGroupOBJ = csvValuesData[j];
                    for (var k = 0; k < lineLevelFieldArray.length; k++) {
                        obj = {};
                        var LineSetObj = lineLevelFieldArray[k];
                        var header = LineSetObj.csvField;
                        var NSid = LineSetObj.NSField;
                        var val = csvValuesDataGroupOBJ[header];
                        if (NSid == 'item') {
                            lineNumber = NetsuiteRecordUpdate.findSublistLineWithValue({
                                sublistId: 'item',
                                fieldId: 'item',
                                value: val
                            });
                            if (lineNumber != -1) {
                                obj.lineNum = lineNumber;
                                newArray.push(obj);
                            }else{
                                newLineAddArray.push(csvValuesDataGroupOBJ);
                            }
                        }
                    }
                }
                log.debug({
                    title: 'newArray UPDATE Line',
                    details: newArray
                });
                log.debug({
                    title: 'newLineAddArray UPDATE Line',
                    details: newLineAddArray
                });
                if(newArray && newArray.length){
                    for (var p = 0; p < newArray.length; p++) {
                        var csvValuesDataGroupOBJ = csvValuesData[p];
                        for (var k = 0; k < lineLevelFieldArray.length; k++) {
                            var LineSetObj = lineLevelFieldArray[k];
                            var header = LineSetObj.csvField;
                            var NSid = LineSetObj.NSField;
                            var val = csvValuesDataGroupOBJ[header];
                            NetsuiteRecordUpdate.setSublistValue({
                                sublistId: 'item',
                                fieldId: NSid,
                                value: val,
                                line: newArray[p].lineNum,
                                ignoreFieldChange: true
                            });
                        }
                    }
                }
                var lineCount = NetsuiteRecordUpdate.getLineCount({
                    sublistId: 'item'
                });
                if(newLineAddArray && newLineAddArray.length){
                    for (var q = 0; q < newLineAddArray.length; q++) {
                        var csvValuesOBJ = newLineAddArray[q];
                        for (var l = 0; l < lineLevelFieldArray.length; l++) {
                            var LineSetObj = lineLevelFieldArray[l];
                            var header = LineSetObj.csvField;
                            var NSid = LineSetObj.NSField;
                            var val = csvValuesOBJ[header];
                            NetsuiteRecordUpdate.setSublistValue({
                                sublistId: 'item',
                                fieldId: NSid,
                                value: val,
                                line: lineCount + q,
                                ignoreFieldChange: true
                            });
                        }
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
            }
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
        // return NetsuiteRecordUpdate;
    }
    function sortBinTransferInvDetail(array) {
        var title = 'sortBinTransferInvDetail(::)';
        try {
            // Find the index of the "inventorydetail" object
            var index = -1;
            for (var i = 0; i < array.length; i++) {
                if (array[i].NSField === "inventorydetail") {
                    index = i;
                    break;
                }
            }

            // If the "inventorydetail" object is found, move it to the last index
            if (index !== -1) {
                var inventoryDetailObject = array.splice(index, 1)[0];
                array.push(inventoryDetailObject);
            }
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
        return array || [];
    }
    function searchLotItem(id) {
        var title = 'searchItemITem(::)';
        var isLot;
        try {
            var itemSearchObj = search.create({
                type: "item",
                filters:
                    [
                        ["internalid", "anyof", id]
                    ],
                columns:
                    [
                        search.createColumn({
                            name: "itemid",
                            sort: search.Sort.ASC,
                            label: "Name"
                        }),
                        search.createColumn({ name: "type", label: "Type" }),
                        search.createColumn({ name: "islotitem", label: "Is Lot Numbered Item" })
                    ]
            });
            itemSearchObj.run().each(function (result) {
                isLot = result.getValue({ name: 'islotitem' });
                return true;
            });
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
        return isLot;
    }
    function setLotAssemblyInvDetail(NetsuiteRecord, lineLevelFieldArray, csvValuesDataGroupOBJ) {
        var title = 'setLotAssemblyInvDetail(::)';
        try {
            NetsuiteRecord.selectNewLine({
                sublistId: 'inventory'
            });
            for (var k = 0; k < lineLevelFieldArray.length; k++) {
                var LineSetObj = lineLevelFieldArray[k];
                var header = LineSetObj.csvField;
                var NSid = LineSetObj.NSField;
                var val = csvValuesDataGroupOBJ[header];
                if (NSid == 'inventorydetail') {
                    val = val.replace(/\|/g, ",");
                    var string = val.replace(/'/gi, '"');
                    var newArr = string.split('@');
                    for (var n = 0; n < newArr.length; n++) {
                        var invDetailArray = JSON.parse(newArr[n]);
                        var inventoryDetailRecord = NetsuiteRecord.getCurrentSublistSubrecord({
                            sublistId: 'inventory',
                            fieldId: 'inventorydetail'
                        });
                        inventoryDetailRecord.selectNewLine({
                            sublistId: 'inventoryassignment'
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'issueinventorynumber',
                            value: parseInt(invDetailArray.lotNum)
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'binnumber',
                            value: parseInt(invDetailArray.fromId)
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'tobinnumber',
                            value: parseInt(invDetailArray.toId)
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'quantity',
                            value: parseInt(invDetailArray.qty)
                        });
                        inventoryDetailRecord.commitLine({
                            sublistId: 'inventoryassignment'
                        });
                    }
                } else {
                    NetsuiteRecord.setCurrentSublistValue({
                        sublistId: 'inventory',
                        fieldId: NSid,//item
                        value: val,
                        ignoreFieldChange: false
                    });
                }
            }
            NetsuiteRecord.commitLine({
                sublistId: 'inventory'
            });
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
    }
    function setInventoryInvDetail(NetsuiteRecord, lineLevelFieldArray, csvValuesDataGroupOBJ) {
        var title = 'setInventoryInvDetail(::)';
        try {
            NetsuiteRecord.selectNewLine({
                sublistId: 'inventory'
            });
            for (var k = 0; k < lineLevelFieldArray.length; k++) {
                var LineSetObj = lineLevelFieldArray[k];
                var header = LineSetObj.csvField;
                var NSid = LineSetObj.NSField;
                var val = csvValuesDataGroupOBJ[header];
                if (NSid == 'inventorydetail') {
                    val = val.replace(/\|/g, ",");
                    var string = val.replace(/'/gi, '"');
                    var newArr = string.split('@');
                    for (var n = 0; n < newArr.length; n++) {
                        var invDetailArray = JSON.parse(newArr[n]);
                        var inventoryDetailRecord = NetsuiteRecord.getCurrentSublistSubrecord({
                            sublistId: 'inventory',
                            fieldId: 'inventorydetail'
                        });
                        inventoryDetailRecord.selectNewLine({
                            sublistId: 'inventoryassignment'
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'binnumber',
                            value: parseInt(invDetailArray.fromId)
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'tobinnumber',
                            value: parseInt(invDetailArray.toId)
                        });
                        inventoryDetailRecord.setCurrentSublistValue({
                            sublistId: 'inventoryassignment',
                            fieldId: 'quantity',
                            value: parseInt(invDetailArray.qty)
                        });
                        inventoryDetailRecord.commitLine({
                            sublistId: 'inventoryassignment'
                        });
                    }
                } else {
                    NetsuiteRecord.setCurrentSublistValue({
                        sublistId: 'inventory',
                        fieldId: NSid,//item
                        value: val,
                        ignoreFieldChange: false
                    });
                }
            }
            NetsuiteRecord.commitLine({
                sublistId: 'inventory'
            });
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
    }
});
define(['N/record','../class/createCSVFile.js'], function (record,createCSVLogfile) {
    var logError = [];
    return {
        Create : function (csvValuesData,createRecordinArray,rectype,LineLevelData) {
            var title = 'CustLogging()::';
            try {
                log.debug({
                    title: 'Record create Function Call in CustLogging',
                    details: rectype
                });
                rectype = rectype.toString();
            var NetsuiteRecordCreate = record.create({
                        type: rectype,
                        isDynamic: true
            });
            var csvValuesDataGroupOBJ = csvValuesData[0];
            createRecordinArray = JSON.parse(createRecordinArray);
            for(var i = 0; i < createRecordinArray.length; i++){
                var FieldSetObj = createRecordinArray[i];
                var header = FieldSetObj.csvField;
                var NSid = FieldSetObj.NSField;
                // var val = csvValuesData[header];
                var val = csvValuesDataGroupOBJ[header];
                if(header == 'date'){
                    var date = new Date(val);
                    NetsuiteRecordCreate.setValue({
                        fieldId: NSid,
                        value: date
                    });
                }else{
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
                title: 'Record create In NetSuite  ID',
                details: recordId
            });
                
        } catch (error) {
                log.error(title + error.name, error.message);
            }
        },
        Update : function (csvValuesData,createRecordinArray,rectype,LineLevelData) {
            var title = 'CustLogging() Update::';
            var loadrec;
            try {
                log.debug({
                    title: 'Record Update Function Call in CustLogging Update',
                    details: rectype
                });
                rectype = rectype.toString();
            
            createRecordinArray = JSON.parse(createRecordinArray);
            for(var i = 0; i < createRecordinArray.length; i++){
                var FieldSetObj = createRecordinArray[i];
                var header = FieldSetObj.csvField;
                var NSid = FieldSetObj.NSField;
                var val = csvValuesData[header];
                if(NSid == 'id'){
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
            for(var i = 0; i < createRecordinArray.length; i++){
                var FieldSetObj = createRecordinArray[i];
                var header = FieldSetObj.csvField;
                var NSid = FieldSetObj.NSField;
                var val = csvValuesData[header];
                if(header == 'date'){
                    var date = new Date(val);
                    NetsuiteRecordCreate.setValue({
                        fieldId: NSid,
                        value: date
                    });
                }else{
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
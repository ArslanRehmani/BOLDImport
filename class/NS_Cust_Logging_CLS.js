define(['N/record'], function (record) {
    var logError = [];
    return {
        Create : function (csvValuesData,finalArray,createRecordinArray,rectype) {
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
            
            createRecordinArray = JSON.parse(createRecordinArray);
            for(var i = 0; i < createRecordinArray.length; i++){
                var FieldSetObj = createRecordinArray[i];
                var header = FieldSetObj.csvField;
                var NSid = FieldSetObj.NSField;
                var val = csvValuesData[header];
                log.debug({
                    title: 'val',
                    details: val
                });
                log.debug({
                    title: 'NSid',
                    details: NSid
                });
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
        Update : function (csvValuesData,finalArray,createRecordinArray,rectype) {
            var title = 'CustLogging() Update::';
            try {
                log.debug({
                    title: 'Record create Function Call in CustLogging Update',
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
        }
    };
    
});
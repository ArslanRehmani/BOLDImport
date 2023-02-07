
define(['N/log','N/record','N/file'], function (log,record,file) {
    return {
        fields:{
            fieldId: 'custrecord_ab_maped_record_field',
            lineFieldId: 'custrecord_ab_maped_record_linefield'
        },
        recordId:{
            id: 'customrecord_ab_maped_record'
        },
        createMapFieldRecords: function (createRecordinArray,createRecordLineLeveldata) {
            var title = 'createMapFieldRecords()::';
            try {
                var mapRecordCreate = record.create({
                    type: this.recordId.id,
                    isDynamic: true
                });
                mapRecordCreate.setValue(this.fields.fieldId, createRecordinArray);
                mapRecordCreate.setValue(this.fields.lineFieldId, createRecordLineLeveldata);
                mapRecordCreate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
            } catch (error) {
                log.error(title + error.name, error.message)
            }
        },
        createCSVFileInCabinet: function (csvDataFolderID,csvArray){
            var title = 'createCSVFileInCabinet(::)';
            try{
                //Create file in File Cabniet to store CSV file data
                var fileObj = file.create({
                    name: 'CSV Data',
                    fileType: file.Type.JSON,
                    contents: csvArray,
                    folder: csvDataFolderID,
                    isOnline: true
                });
                // Save the file
                var id = fileObj.save();
                return id;
            } catch(e) {
                log.debug('Exception ' +title, e.message);
            }
            
        }
    }
});
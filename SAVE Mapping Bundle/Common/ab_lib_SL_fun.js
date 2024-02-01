
define(['N/log','N/record','N/file'], function (log,record,file) {
    return {
        fields:{
            fieldId: 'custrecord_ab_maped_record_field',
            csvFileId: 'custrecord_ab_csv_file',
            createUpdate: 'custrecord_create_or_update',
            recordType: 'custrecord_create_rec_type',
            recName: 'name',
            csvJSONFormate: 'custrecord_ab_csv_json_formate_field'
        },
        recordId:{
            id: 'customrecord_ab_maped_record'
        },
        createMapFieldRecords: function (createRecordinArray,csvFileId,rectypetostring,UpdateRecord,uploadedCSVFileName,csvJSONFileId) {
            var title = 'createMapFieldRecords()::';
            try {
                var mapRecordCreate = record.create({
                    type: this.recordId.id,
                    isDynamic: true
                });
                mapRecordCreate.setValue(this.fields.fieldId, createRecordinArray);
                mapRecordCreate.setValue(this.fields.csvFileId, csvFileId);
                if(!!UpdateRecord && UpdateRecord == 1){
                    mapRecordCreate.setValue(this.fields.createUpdate, 'Update');
                }else{
                    mapRecordCreate.setValue(this.fields.createUpdate, 'Create');
                }
                mapRecordCreate.setValue(this.fields.recordType, rectypetostring);
                mapRecordCreate.setValue(this.fields.recName, uploadedCSVFileName);
                mapRecordCreate.setValue(this.fields.csvJSONFormate, csvJSONFileId);
               var id = mapRecordCreate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
            } catch (error) {
                log.error(title + error.name, error.message)
            }
            return id;
        },
        createCSVFileInCabinet: function (csvDataFolderID,csvArray,uploadedCSVFileName){
            var title = 'createCSVFileInCabinet(::)';
            try{
                //Create file in File Cabniet to store CSV file data
                var currentTimestamp = new Date().getTime();
                var fileObj = file.create({
                    name: uploadedCSVFileName + currentTimestamp,
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
            
        },
        createCSVFileInCabinetExcelFormate: function (csvDataFolderIDExcelFormate,uploadedCSVFileName,uploadedCSVFileData){
            var title = 'createCSVFileInCabinetExcelFormate(::)';
            try{
                //Create file in File Cabniet to store CSV file data
                var currentTimestamp = new Date().getTime();
                var fileObj = file.create({
                    name: uploadedCSVFileName + currentTimestamp,
                    fileType: file.Type.CSV,
                    contents: uploadedCSVFileData,
                    folder: csvDataFolderIDExcelFormate,
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
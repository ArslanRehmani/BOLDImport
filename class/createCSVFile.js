define(['N/record','N/log','N/file'], function (record,log,file,url) {
    return {
        createCSVFile : function (errorArray, properties) {
            var title = 'createCSVFile()::';
            try {
                
                if (!properties || properties.length == 0) {
                    log.debug({
                        title: 'the CSV log cannot be generated, -properties- attribute is missing',
                        details: 'the CSV log cannot be generated, -properties- attribute is missing'
                    });
                    return;
                }
        
                //loop through the property array, build a header
                var csvHeader = '';
        
                for (var i = 0; i < properties.length; i++) {
                    csvHeader += properties[i] + ',';
                }
                csvHeader += '\n';
                log.debug({
                    title: "csvHeader += '\n';",
                    details: csvHeader
                });
                var csvDetails = '';
        
                for (var j = 0; j < errorArray.length; j++) {
                    var csvLine = '';
                    var counter = 0;
                    while (counter != properties.length) {
                        csvLine += errorArray[j][properties[counter]] + ',';
                        counter++;
                        log.debug({
                            title: "errorArray[j][properties[counter]]",
                            details: errorArray[j][properties[counter]]
                        });
                    }
                    csvLine += '\n';
                    
                    csvDetails += csvLine;
                    log.debug({
                        title: "csvDetails===",
                        details: csvDetails
                    });
                }
        
                var csvFullData = csvHeader + csvDetails;
                var fileNamePrefix = 'csv_log_';
                var currentTimestamp = new Date().getTime();
        
                //Create file in File Cabniet to store CSV file data
                var csvFile = file.create({
                    name: 'Error file' + currentTimestamp,
                    fileType: file.Type.CSV,
                    contents: csvFullData,
                    folder: 14525,
                    isOnline: true
                    });
                
                    // Save the file
                    var id = csvFile.save();
                    log.debug({
                        title: 'Error file folder ID',
                        details: id
                    });
                    
                // csvFile.setFolder(ERROR_LOG_FOLDER);
                // //internal id of the folder in the file cabinet
                // var id = nlapiSubmitFile(csvFile);
                return id;
            
                
        } catch (error) {
            log.error({
                title: title +'The script failed to submit a csv file.',
                details: 'The script failed to submit a csv file.' + error.toString()
            })
            }

        }

    };
});
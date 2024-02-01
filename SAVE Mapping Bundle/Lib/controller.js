define(['../class/NS_standardCLS_createRecord_throughBIT_saveMap.js'],
    function (NS_StandardCLS) {
        return {
            recTypeSwitch: function (csvValuesData, createRecordinArray, rectype, selectOption, saveMappingRecID, errorFileFolder,remainingCSVFields) {
                var title = 'recTypeSwitch(::)';
                try {
                    if((rectype == 'intercompanytransferorder') || (rectype == 'transferorder') || (rectype == 'workorder') || (rectype == 'salesorder') || (rectype == 'itemfulfillment')){
                        if (selectOption == 1) {
                            NS_StandardCLS.Update(csvValuesData, createRecordinArray, rectype, saveMappingRecID, errorFileFolder, remainingCSVFields);
                        } else {
                            NS_StandardCLS.Create(csvValuesData, createRecordinArray, rectype, saveMappingRecID, errorFileFolder, remainingCSVFields);
                        }
                    }else if(rectype == 'bintransfer'){
                        if (selectOption == 1) {
                            NS_StandardCLS.Update(csvValuesData, createRecordinArray, rectype, saveMappingRecID, errorFileFolder, remainingCSVFields);
                        } else {
                            NS_StandardCLS.Create(csvValuesData, createRecordinArray, rectype, saveMappingRecID, errorFileFolder, remainingCSVFields);
                        }
                    }
                } catch (e) {
                    log.debug('Exception ' + title, e.message);
                }
            }

        };
    });
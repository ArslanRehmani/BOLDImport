/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
 * 
 * The following javascript code is created by ALPHABOLD Consultants LLC, 
 * a NetSuite Partner. It is a SuiteFlex component containing custom code 
 * intended for NetSuite (www.netsuite.com) and use the SuiteScript API. 
 * The code is provided "as is": ALPHABOLD Inc. shall not be liable 
 * for any damages arising out the intended use or if the code is modified 
 * after delivery. 
 * 
 * Company:		ALPHABOLD Consultants LLC, www.AlphaBOLDconsultants.com 
 * Author:		marslan@AlphaBOLD.com 
 * File:		ab_mr_createRecord_save_mapping.js
 * Date:		01/01/2022
 * 
 ***********************************************************************/
define(['N/log', 'N/runtime', 'N/file', '../Lib/controller.js'], function (log, runtime, file, ControllerLib) {

    function getInputData() {
        try {
            var csvDataFolderID = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_upload_csv_id'
            });
            var CSVData = file.load({ id: csvDataFolderID });
            var CSVDataValue = CSVData.getContents();
            CSVDataValue = JSON.parse(CSVDataValue);
            var groupedSOID = groupArrayOfObjects(CSVDataValue, "Unique ID");
            return groupedSOID;
        } catch (ex) {
            log.error('getInputData error: ', ex.message);
        }
    }
    function map(context) {
        try {
            var csvValuesData = JSON.parse(context.value);
            var rectype = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_sel_rec_type'
            });
            var createRecordinArray = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_netsuite_array'
            });
            var selectOption = runtime.getCurrentScript().getParameter({//for only update record
                name: 'custscript_ab_update_record'
            });
            var saveMappingRecID = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_savemapping_rec_id'
            });
            var errorFileFolder = runtime.getCurrentScript().getParameter({
                name: 'custscript_mr_error_file_folder'
            });
            var remainingCSVFields = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_remainingcsvarray'
            });
            //Call Controller class that create records in NS
            ControllerLib.recTypeSwitch(csvValuesData, createRecordinArray, rectype, selectOption, saveMappingRecID, errorFileFolder,remainingCSVFields);
        } catch (ex) {
            log.error('Map error: ', ex.message);
        }
    }

    function groupArrayOfObjects(list, key) {
        return list.reduce(function (rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };

    return {
        getInputData: getInputData,
        map: map
    }
});

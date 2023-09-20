/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
 *
 *********************************************************************** 
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
 * File:		ab_mr_createRecord.js 
 * Date:		01/01/2022
 * 
 ***********************************************************************/
define(['N/log', 'N/runtime', 'N/file', '../Library/Controller.js'],
    function (log, runtime, file, ControllerLib) {

        function getInputData() {
            var title = 'getInputData(::)';
            try {
                var csvDataFolderID = runtime.getCurrentScript().getParameter({
                    name: 'custscript_ab_upload_csv_file_id'
                });
                var CSVData = file.load({ id: csvDataFolderID });
                var CSVDataValue = CSVData.getContents();
                CSVDataValue = JSON.parse(CSVDataValue);
                var groupedUniqueID = groupArrayOfObjects(CSVDataValue, "Unique ID");
                return groupedUniqueID;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        function map(context) {
            var title = 'map(::)';
            try {
                var csvValuesData = JSON.parse(context.value);
                var rectype = runtime.getCurrentScript().getParameter({
                    name: 'custscript_ab_rectype'
                });
                var bodyFieldsLineFieldsOBJ = runtime.getCurrentScript().getParameter({
                    name: 'custscript_ab_body_line_field_obj'
                });
                var selectOption = runtime.getCurrentScript().getParameter({//for only update record
                    name: 'custscript_ab_select_option'
                });
                //Call Controller class that create records in NS
                ControllerLib.recTypeSwitch(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, selectOption);
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }

        function groupArrayOfObjects(list, key) {
            var title = 'groupArrayOfObjects(::)';
            try {
                return list.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        };

        return {
            getInputData: getInputData,
            map: map
        }
    });

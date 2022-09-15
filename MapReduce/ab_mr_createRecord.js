/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
 */
define(['N/log', 'N/runtime', 'N/file', '../Library/Controller.js'], function (log, runtime, file, ControllerLib) {

    function getInputData() {
        try {
            var csvDataFolderID = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_csv_data_length'
            });
            var CSVData = file.load({ id: csvDataFolderID });
            CSVDataValue = CSVData.getContents();
            CSVDataValue = JSON.parse(CSVDataValue);
            var groupedSOID = groupArrayOfObjects(CSVDataValue,"SOID");
            // return CSVDataValue;
            return groupedSOID;
        } catch (ex) {
            log.error('getInputData error: ', ex.message);
        }
    }
    function map(context) {
        try {
            var csvValuesData = JSON.parse(context.value);
            var rectype = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_rectype'
            });
            var createRecordinArray = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_record_id_array'
            });
            var selectOption = runtime.getCurrentScript().getParameter({//for only update record
                name: 'custscript_ab_select_option'
            });
            var LineLevelData = runtime.getCurrentScript().getParameter({//for only update record
                name: 'custscript_ab_line_level_data'
            });
            //Call Controller class that create records in NS
            ControllerLib.recTypeSwitch(csvValuesData,createRecordinArray,rectype,selectOption,LineLevelData);
        } catch (ex) {
            log.error('Map error: ', ex.message);
        }
    }

    function reduce(context) {

    }

    function summarize(summary) {
        log.debug({
            title: 'Summary Working',
            details: 'working'
        });
    }

    function groupArrayOfObjects(list, key) {
        return list.reduce(function(rv, x) {
          (rv[x[key]] = rv[x[key]] || []).push(x);
          return rv;
        }, {});
      };

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});

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
            log.debug({
                title: 'csvData in Map Reduce',
                details: csvDataFolderID
            });
            var recType = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_rectype'
            });
            log.debug({
                title: 'recType in Map Reduce',
                details: recType
            });
            var CSVData = file.load({ id: csvDataFolderID });//71728
            CSVDataValue = CSVData.getContents();
            log.debug('CSVDataValue', CSVDataValue);
            CSVDataValue = JSON.parse(CSVDataValue);
            //testing group data here
            /*var CSVDataValueGroup = CSVDataValue.reduce(function (r, a) {
                r[a.SOID] = r[a.SOID] || [];
                r[a.SOID].push(a);
                return r;
            }, Object.create(null));
            log.debug('CSVDataValueGroup', CSVDataValueGroup);*/
            //end here
            var groupedSOID=groupArrayOfObjects(CSVDataValue,"SOID");
            log.debug('groupedSOID', groupedSOID);
            // groupedSOID = JSON.parse(groupedSOID);
            // var key = Object.keys(groupedSOID);
            // log.debug('Object.keys(groupedSOID.So1)', Object.keys(groupedSOID.So1[0]));
            // return CSVDataValue;
            return groupedSOID;
        } catch (ex) {
            log.error('getInputData error: ', ex.message);
        }

    }

    function map(context) {
        try {
            var csvValuesData = JSON.parse(context.value);
            log.debug({
                title: 'csvValuesData',
                details: csvValuesData
            });
            var rectype = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_rectype'
            });
            var finalArray = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_cvs_final_header_array'
            });
            log.debug({
                title: 'finalArray======',
                details: finalArray
            });
            var createRecordinArray = runtime.getCurrentScript().getParameter({
                name: 'custscript_ab_record_id_array'
            });
            log.debug({
                title: 'createRecordinArray====',
                details: createRecordinArray
            });
            var selectOption = runtime.getCurrentScript().getParameter({//for only update record
                name: 'custscript_ab_select_option'
            });
            log.debug({
                title: 'selectOption==== in MR',
                details: selectOption
            });
            var LineLevelData = runtime.getCurrentScript().getParameter({//for only update record
                name: 'custscript_ab_line_level_data'
            });
            log.debug({
                title: 'LineLevelData==== in MR',
                details: LineLevelData
            });
            //Call Controller class that create records in NS
            ControllerLib.recTypeSwitch(csvValuesData,finalArray,createRecordinArray,rectype,selectOption,LineLevelData);
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

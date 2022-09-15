/**
 *@NApiVersion 2.0
*@NScriptType Suitelet
*/
define(['N/ui/serverWidget', 'N/log', 'N/file', 'N/record', '../common/ab_lib_convertCSVToJson.js', 'N/currentRecord', 'N/ui/dialog', '../Library/Controller.js', 'N/task', '../class/ab_map_reduce_status_CLS.js', '../common/ab_lib_common.js', '../common/ab_lib_stepper.js', '../common/ab_lib_SL_fun.js', '../common/ab_lib_mr_fun.js'], function (serverWidget, log, file, record, convertCSVLIB, currentRecord, dialog, ControllerLib, task, MRstatusCLS, commonLib, addStepperLib, SlFunLib,mrFunLib) {

    function onRequest(context) {
        var title = 'OnRequestSL::'
        var request = context.request;
        var response = context.response;
        var form = serverWidget.createForm({
            title: 'CSV Impot'
        });
        var UpdateRecord;
        var assistance = serverWidget.createAssistant({
            title: 'BOLDImport Assistant'
        });
        //client Script call
        assistance.clientScriptModulePath = '../client/ab_cs_function_csv.js';
        try {
            var scanUploadSTP = assistance.addStep({
                id: 'custpage_ab_scan_step',
                label: 'Scan & Upload CSV File'
            });
            var importOptSTP = assistance.addStep({
                id: 'custpage_ab_importopt',
                label: 'Import Options'
            });
            var fileMapSTP = assistance.addStep({
                id: 'custpage_ab_filemap',
                label: 'File & Field Mapping'
            });
            var fieldMapSTP = assistance.addStep({
                id: 'custpage_ab_fieldmap',
                label: 'CSV Import Message'
            });
            var saveMapSTP = assistance.addStep({
                id: 'custpage_ab_savemap',
                label: 'Save mapping & Start Import'
            });
            //Select option get here through function from 3rd step and pass parameter to Map reduce
            var selectOption = commonLib.getSelectOption(assistance);
            var internalidObj = commonLib.internalidOBJ(assistance);
            if (selectOption == 'Update' && internalidObj == '1') {
                UpdateRecord = 1;//update record in NS
            } else {
                UpdateRecord = 2;//not update give error if yu want to update rec in NS
            }
            if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.NEXT || assistance.getLastAction() == serverWidget.AssistantSubmitAction.BACK) {
                if (assistance.currentStep.id == "custpage_ab_filemap") {
                    var require = commonLib.getThirdStepFieldMapLengthRequire(assistance);
                    var lenghtEqual = commonLib.getThirdStepFieldMapLength(assistance);
                    if ((require == 'true' || require == true) && (lenghtEqual == 'true' || lenghtEqual == true)) {
                        var createRecordinArray = commonLib.createRecordInnetsuite(assistance);
                        var createRecordLineLeveldata = commonLib.createRecordLineLevelData(assistance);
                        SlFunLib.createMapFieldRecords(createRecordinArray, createRecordLineLeveldata)
                        var mapedFieldArray = commonLib.mapedFieldArrayfunction(assistance);
                        mapedFieldArray = JSON.parse(mapedFieldArray);
                        var rectype = commonLib.recordType(assistance);
                        var rectypetostring = rectype.toString();
                        var csvDatArray = commonLib.csvDatafromSecondStep(assistance);
                        //Create file in File Cabniet to store CSV file data
                        var csvFileId = SlFunLib.createCSVFileInCabinet(csvDatArray);
                        log.debug({
                            title: 'csvFileId',
                            details: csvFileId
                        });
                        //Call MapReduce Script for record creation & return id
                        var mapReduceId = mrFunLib.mapReduceTaskStatus(csvFileId,rectypetostring,createRecordinArray,UpdateRecord,createRecordLineLeveldata);
                        var mrSummary = task.checkStatus({
                            taskId: mapReduceId
                        });
                        var taskStatus = mrSummary.status;
                        log.debug(title + 'Task Status', mrSummary.status);
                        MRstatusCLS.Create(mapReduceId, taskStatus, csvFileId);

                        assistance.currentStep = assistance.getNextStep();
                    } else {
                        var MapNotEqual = assistance.addField({
                            id: 'custpage_ab_mapnotequal',
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'Mapping Fields length not Euqal'
                        });
                        MapNotEqual.defaultValue = '<p style="color: red;">Please Select All *(require) fields and Map Equal Rows in map table</p>';
                    }
                }
                else {
                    assistance.currentStep = assistance.getNextStep();
                }
            } else if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.CANCEL) {
                assistance.currentStep = assistance.getStep({ id: 'custpage_ab_scan_step' });
            } else if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.FINISH) {
                //at the end form is submite here so perform all thinks here
                // add csv import functionalty here

                assistance.finishedHtml = 'You have Completed the BOLDImport Process';
            }

            var currentStepId = assistance.currentStep == null ? 'custpage_ab_scan_step' : assistance.currentStep.id;
            log.debug('currentStepId', currentStepId);
            var tableData = file.load({ id: '../templates/boldimport_table_use.html' });
            indexPageValue = tableData.getContents();
            switch (currentStepId) {
                case 'custpage_ab_scan_step':
                    addStepperLib.buildFirstStep(assistance);
                    break;

                case 'custpage_ab_importopt':
                    addStepperLib.buildSecondStep(assistance);
                    break;

                case 'custpage_ab_filemap':
                    addStepperLib.buildThirdStep(assistance);
                    break;

                case 'custpage_ab_fieldmap':
                    addStepperLib.buildFourthStep(assistance);
                    break;

                case 'custpage_ab_savemap':
                    var saveFld = assistance.addField({
                        id: 'custpage_ab_save',
                        type: serverWidget.FieldType.TEXT,
                        label: 'Your Save Mapping Here'
                    });
                    break;
            }
            response.writePage(assistance);
        } catch (error) {
            log.debug('ERROR', error.message);
        }
    }
    return {
        onRequest: onRequest
    }
});

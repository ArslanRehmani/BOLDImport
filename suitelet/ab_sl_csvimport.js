/**
 *@NApiVersion 2.0
*@NScriptType Suitelet
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
 * File:		ab_sl_csvimport.js 
 * Date:		01/01/2022
 * 
 ***********************************************************************/
define(['N/ui/serverWidget', 'N/log', 'N/task', '../class/ab_map_reduce_status_CLS.js', '../common/ab_lib_common.js', '../common/ab_lib_stepper.js', '../common/ab_lib_SL_fun.js', '../common/ab_lib_mr_fun.js', 'N/runtime'],
    function (serverWidget, log, task, MRstatusCLS, commonLib, addStepperLib, SlFunLib, mrFunLib, runtime) {

        function onRequest(context) {
            var title = 'onRequest(::)';
            try {
                var request = context.request;
                var response = context.response;
                var UpdateRecord, assistance, csvDataFolderID, csvDataFolderIDExcelFormate, selectOption, internalIdObj,
                    require, lenghtEqual, bodyFieldsLineFieldsOBJ, csvDataArray, uploadedCSVFileName, uploadedCSVFileData,
                    fileCabinetUploadedCsvFileId, fileCabinetCsvFileIdExcelFormate, abMapReduceRecordRecType, errorFileFolder;
                assistance = serverWidget.createAssistant({
                    title: 'BOLDImport Assistant'
                });
                csvDataFolderID = runtime.getCurrentScript().getParameter({
                    name: 'custscript_csv_data_folder_id'
                });
                csvDataFolderIDExcelFormate = runtime.getCurrentScript().getParameter({
                    name: 'custscriptab_csv_excel_folder_id'
                });
                abMapReduceRecordRecType = runtime.getCurrentScript().getParameter({
                    name: 'custscript_ab_mapreduce_record_rectype'
                });
                errorFileFolder = runtime.getCurrentScript().getParameter({
                    name: 'custscript_ab_error_file_folder'
                });
                //client Script call
                assistance.clientScriptModulePath = '../client/ab_cs_function_csv.js';
                assistance.addStep({
                    id: 'custpage_ab_scan_step',
                    label: 'Scan & Upload CSV File'
                });
                assistance.addStep({
                    id: 'custpage_ab_importopt',
                    label: 'Import Options'
                });
                assistance.addStep({
                    id: 'custpage_ab_filemap',
                    label: 'File & Field Mapping'
                });
                assistance.addStep({
                    id: 'custpage_ab_fieldmap',
                    label: 'CSV Import Message'
                });
                //Select option get here through function from 3rd step and pass parameter to Map reduce
                selectOption = commonLib.getSelectOption(assistance);
                internalIdObj = commonLib.internalidOBJ(assistance);
                if (selectOption == 'Update' && internalIdObj == '1') {
                    UpdateRecord = 1;//update record in NS
                } else {
                    UpdateRecord = 2;//not update give error if yu want to update rec in NS
                }
                if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.NEXT || assistance.getLastAction() == serverWidget.AssistantSubmitAction.BACK) {
                    if (assistance.currentStep.id == "custpage_ab_filemap") {
                        require = commonLib.getThirdStepFieldMapLengthRequire(assistance);
                        lenghtEqual = commonLib.getThirdStepFieldMapLength(assistance);
                        if ((require == 'true' || require == true) && (lenghtEqual == 'true' || lenghtEqual == true)) {
                            bodyFieldsLineFieldsOBJ = commonLib.createRecordInnetsuite(assistance);
                            var rectype = commonLib.recordType(assistance);
                            var rectypetostring = rectype.toString();
                            csvDataArray = commonLib.csvDatafromSecondStep(assistance);
                            uploadedCSVFileName = commonLib.uploadedcsvFileNameSecondStep(assistance);
                            uploadedCSVFileData = commonLib.uploadedcsvFileDataSecondStep(assistance);
                            var saveMapName = commonLib.bitSaveMappingName(assistance);
                            log.debug({
                                title: 'saveMapName',
                                details: saveMapName
                            });
                            //Create file in File Cabniet to store CSV file data
                            fileCabinetUploadedCsvFileId = SlFunLib.createCSVFileInCabinet(csvDataFolderID, csvDataArray, uploadedCSVFileName);
                            //create Excel formate file in file cabinet
                            fileCabinetCsvFileIdExcelFormate = SlFunLib.createCSVFileInCabinetExcelFormate(csvDataFolderIDExcelFormate, uploadedCSVFileName, uploadedCSVFileData);
                            SlFunLib.createMapFieldRecords(bodyFieldsLineFieldsOBJ, fileCabinetCsvFileIdExcelFormate, rectypetostring, UpdateRecord, uploadedCSVFileName, fileCabinetUploadedCsvFileId);
                            //Call MapReduce Script for record creation & return id
                            var mapReduceId = mrFunLib.mapReduceTaskStatus(fileCabinetUploadedCsvFileId, rectypetostring, bodyFieldsLineFieldsOBJ, UpdateRecord, errorFileFolder);
                            var mrSummary = task.checkStatus({
                                taskId: mapReduceId
                            });
                            var taskStatus = mrSummary.status;
                            MRstatusCLS.Create(mapReduceId, taskStatus, fileCabinetUploadedCsvFileId);

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
                    assistance.currentStep = assistance.getStep({ id: 'custpage_ab_scan_step' });
                }
                var currentStepId = assistance.currentStep == null ? 'custpage_ab_scan_step' : assistance.currentStep.id;
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
                        addStepperLib.buildFourthStep(assistance,abMapReduceRecordRecType);
                        break;
                }
                response.writePage(assistance);
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        return {
            onRequest: onRequest
        }
    });

/**
 *@NApiVersion 2.0
*@NScriptType Suitelet
*/
define(['N/ui/serverWidget', 'N/log', 'N/file', 'N/record', '../common/ab_lib_convertCSVToJson.js', 'N/currentRecord', 'N/ui/dialog', '../Library/Controller.js', 'N/task', '../class/ab_map_reduce_status_CLS.js'], function (serverWidget, log, file, record, convertCSVLIB, currentRecord, dialog, ControllerLib, task, MRstatusCLS) {

    function onRequest(context) {
        var title = 'OnRequestSL::'
        var request = context.request;
        var response = context.response;
        var form = serverWidget.createForm({
            title: 'CSV Impot'
        });
        var recStep;
        var NetsuiteMapData;
        var csvMapData;

        //client Script call

        var assistance = serverWidget.createAssistant({
            title: 'BOLDImport Assistant'
        });
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
            var selectOption = getSelectOption(assistance);
            log.debug({
                title: 'selectOption ====<<<<bhr',
                details: selectOption
            });
            var internalidObj = internalidOBJ(assistance);
            log.debug({
                title: 'internalidObj ====<<<<bhr',
                details: internalidObj
            });
            if (selectOption == 'Update' && internalidObj == '1') {
                var UpdateRecord = 1;//update record in NS
                log.debug({
                    title: 'UpdateRecord ====<<<<bhr',
                    details: 'UpdateRecord'
                });
            } else {
                var UpdateRecord = 2;//not update give error if yu want to update rec in NS
            }
            if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.NEXT || assistance.getLastAction() == serverWidget.AssistantSubmitAction.BACK) {
                if (assistance.currentStep == null) {
                    recStep = assistance.getStep({
                        id: 'custpage_ab_scan_step'
                    });
                    var val = recStep.getValue({
                        id: 'custpage_ab_htmlfield',
                    });
                    log.debug(title + 'val', val);
                }
                log.debug('assistance.currentStep', assistance.currentStep.id);
                if (assistance.currentStep.id == "custpage_ab_filemap") {

                    var require = GetThirdStepFieldMapLengthRequire(assistance);
                    var lenghtEqual = GetThirdStepFieldMapLength(assistance);

                    if ((require == 'true' || require == true) && (lenghtEqual == 'true' || lenghtEqual == true)) {
                        var createRecordinArray = createRecordInnetsuite(assistance);
                        var objRecord = record.create({
                            type: 'customrecord_ab_maped_record',
                            isDynamic: true
                        });
                        objRecord.setValue('custrecord_ab_maped_record_field', createRecordinArray);
                        var recordId = objRecord.save({
                            enableSourcing: true,
                            ignoreMandatoryFields: true
                        });
                        log.debug({
                            title: '====> createRecordinArray',
                            details: createRecordinArray
                        });
                        // var mapedFieldArray = createRecordinArray;
                        var mapedFieldArray = mapedFieldArrayfunction(assistance);
                        mapedFieldArray = JSON.parse(mapedFieldArray);
                        log.debug({
                            title: '====> mapedFieldArray',
                            details: mapedFieldArray
                        });
                        var finalArray = [];
                        var NetsuiteIdArray = [];
                        for (var i = 0; i < mapedFieldArray.length; i++) {
                            var firstobj = mapedFieldArray[i];
                            var firstobjkey = Object.keys(firstobj);
                            NetsuiteIdArray.push(firstobjkey);
                            var values = firstobj[firstobjkey];
                            finalArray.push(values);
                        }
                        log.debug({
                            title: 'finalArray ====>',
                            details: finalArray
                        });
                        log.debug({
                            title: 'NetsuiteIdArray ====>',
                            details: NetsuiteIdArray
                        });
                        var rectype = RecordType(assistance);
                        var rectypetostring = rectype.toString();
                        var csvDatArray = CSVDatafromSecondStep(assistance);

                        //Create file in File Cabniet to store CSV file data
                        var fileObj = file.create({
                            name: 'CSV Data',
                            fileType: file.Type.JSON,
                            contents: csvDatArray,
                            folder: 14272,
                            isOnline: true
                        });
                        // Save the file
                        var id = fileObj.save();
                        //Call MapReduce Script for record creation
                        var mapReduce = task.create({
                            taskType: task.TaskType.MAP_REDUCE,
                            scriptId: 'customscript_ap_mr_create_record_csv',
                            deploymentId: 'customdeploy_ap_mr_create_record_csv',
                            params: {
                                'custscript_ab_csv_data_length': id,
                                'custscript_ab_rectype': rectypetostring,
                                'custscript_ab_cvs_final_header_array': finalArray,
                                'custscript_ab_record_id_array': createRecordinArray,
                                'custscript_ab_select_option': UpdateRecord
                            }
                        });
                        log.debug({
                            title: 'UpdateRecord MR ====>',
                            details: UpdateRecord
                        });
                        // Submit the map/reduce task
                        var mapReduceId = mapReduce.submit();
                        log.debug({
                            title: 'mapReduceId ====>',
                            details: mapReduceId
                        });
                        var summary1 = task.checkStatus({
                            taskId: mapReduceId
                        });
                        var taskStatus = summary1.status;
                        log.debug(title + 'Task Status', summary1.status);
                        MRstatusCLS.Create(mapReduceId, taskStatus, id);

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
            log.debug('Templates', indexPageValue);
            switch (currentStepId) {
                case 'custpage_ab_scan_step':
                    buildFirstStep(assistance);
                    break;

                case 'custpage_ab_importopt':
                    buildSecondStep(assistance);
                    break;

                case 'custpage_ab_filemap':
                    buildThirdStep(assistance);
                    log.debug('buildThirdStep', 'buildThirdStep123');
                    break;

                case 'custpage_ab_fieldmap':
                    buildFourthStep(assistance);
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
    //First step
    function buildFirstStep(assistance) {
        var title = 'buildFirstStep()::';
        var HTMLInput = '<input  class="box__file" type="file" id="file" accept=".csv" onchange="getJsonCSV();">'
        try {
            var nameFld = assistance.addField({
                id: 'custpage_ab_record_type',
                type: serverWidget.FieldType.SELECT,
                label: 'Record Type'
            });
            nameFld.isMandatory = true;//arslan
            var chooseFile = assistance.addField({
                id: 'custpage_ab_htmlfield',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Intelisys'
            });
            chooseFile.updateLayoutType({
                layoutType: serverWidget.FieldLayoutType.NORMAL
            });
            chooseFile.defaultValue = HTMLInput;

        } catch (error) {
            log.error(title + error.name, error.message)
        }
    }
    //Second step
    function buildSecondStep(assistance) {
        var title = 'buildSecondStep()::';
        try {
            var addFld = assistance.addField({
                id: 'custpage_ab_add',
                name: 'csv_ab_btn',
                type: serverWidget.FieldType.RADIO,
                label: 'ADD',
                source: 'Add'
            });
            var updateFld = assistance.addField({
                id: 'custpage_ab_add',
                name: 'csv_ab_btn',
                type: serverWidget.FieldType.RADIO,
                label: 'UPDATE',
                source: 'Update'
            });
            var addUpdateFld = assistance.addField({
                id: 'custpage_ab_add',
                name: 'csv_ab_btn',
                type: serverWidget.FieldType.RADIO,
                label: 'ADD OR UPDATE',
                source: 'Add_Update'
            });
            var CSVDataThirdStep = assistance.addField({
                id: 'custpage_ab_csvdata',
                type: serverWidget.FieldType.LONGTEXT,
                label: 'CSV Data'
            });
            CSVDataThirdStep.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            log.debug({
                title: 'CSVDataThirdStep ------->',
                details: CSVDataThirdStep
            });
            var selectOption = assistance.addField({
                id: 'custpage_ab_selectoption',
                type: serverWidget.FieldType.TEXT,
                label: 'Select Option'
            });
            selectOption.updateDisplayType({
                // displayType : serverWidget.FieldDisplayType.NORMAL
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            log.debug({
                title: 'selectOption ------->',
                details: selectOption
            });

        } catch (error) {
            log.error(title + error.name, error.message)
        }
    }
    //Third step
    function buildThirdStep(assistance) {
        var title = 'buildThirdStep()::';
        var recordFld, hideFielddata, trueData;
        try {
            recordFld = assistance.addField({
                id: 'custpage_ab_record_type',
                type: serverWidget.FieldType.TEXT,
                label: 'Record Type'
            });
            recordFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            hideFielddata = assistance.addField({
                id: 'custpage_hidden_data_field',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Ns fields'
            });
            hideFielddata.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.NORMAL
            });
            hideFielddata.defaultValue = '<h1>Fields are loading please wait ... </h1>';

            trueData = assistance.addField({
                id: 'custpage_ab_truedata',
                type: serverWidget.FieldType.TEXT,
                label: 'Map Fields...'
            });
            trueData.isMandatory = true;
            trueData.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var requireMapDataLength = assistance.addField({
                id: 'custpage_ab_reuiremapdatalength',
                type: serverWidget.FieldType.TEXT,
                label: '*reuire'
            });
            requireMapDataLength.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var middletablesrow = assistance.addField({
                id: 'custpage_ab_middletablerows',
                type: serverWidget.FieldType.LONGTEXT,
                label: 'Middle Table Rows'
            });
            middletablesrow.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var middletablesrowCsvHeader = assistance.addField({
                id: 'custpage_ab_middletablerows_csv_header',
                type: serverWidget.FieldType.LONGTEXT,
                label: 'Middle Table Rows'
            });
            middletablesrowCsvHeader.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var recType = assistance.addField({
                id: 'custpage_ab_rectypelocalstorage',
                type: serverWidget.FieldType.TEXT,
                label: 'Record Type From Local storage'
            });
            recType.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            var InternalIDUpdate = assistance.addField({
                id: 'custpage_ab_internalidid',
                type: serverWidget.FieldType.TEXT,
                label: 'Internal ID Update OBJ'
            });
            InternalIDUpdate.updateDisplayType({
                // displayType : serverWidget.FieldDisplayType.NORMAL
                displayType: serverWidget.FieldDisplayType.HIDDEN
            });
            log.debug({
                title: 'InternalIDUpdate ------->',
                details: InternalIDUpdate
            });

        } catch (error) {
            log.error(title + error.name, error.message)
        }
    }
    //Fourth step
    function buildFourthStep(assistance) {
        var title = 'buildFourthStep()::';
        try {
            var filedsFld = assistance.addField({
                id: 'custpage_ab_file',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Records Successfully Created'
            });
            filedsFld.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.NORMAL
            });
            filedsFld.defaultValue = '<h1 style="color: green;">Records Successfully Created</h1>';
            var btn = assistance.addField({
                id: 'custpage_ab_btn',
                type: serverWidget.FieldType.INLINEHTML,
                label: 'Records btn'
            });
            btn.updateDisplayType({
                displayType: serverWidget.FieldDisplayType.NORMAL
            });
            btn.defaultValue = '<button> <a onclick="swapRow(event)" title="Delete"></a>View Record</button>';
        } catch (error) {
            log.error(title + error.name, error.message)
        }
    }
    function swapRow(e) {
        alert('Hello');
    }
    function GetThirdStepFieldMapLength(assistance) {
        var title = 'GetThirdStepFieldMapLength()::';
        try {
            var recStep3 = assistance.getStep({
                id: 'custpage_ab_filemap'
            });
            var MapLength = recStep3.getValue({
                id: 'custpage_ab_truedata'
            });
            return MapLength
        } catch (e) {
            log.debug(title + e.message, e.error);
        }

    }
    function GetThirdStepFieldMapLengthRequire(assistance) {
        var title = 'GetThirdStepFieldMapLengthRequire()::';
        try {
            var recStep3 = assistance.getStep({
                id: 'custpage_ab_filemap'
            });
            var require = recStep3.getValue({
                id: 'custpage_ab_reuiremapdatalength'
            });
            return require
        } catch (e) {
            log.debug(title + e.message, e.error);
        }

    }
    function createRecordInnetsuite(assistance) {
        var title = 'createRecordInnetsuite()::';
        try {
            var recStep3 = assistance.getStep({
                id: 'custpage_ab_filemap'
            });
            var middletablerow = recStep3.getValue({
                id: 'custpage_ab_middletablerows'
            });
            return middletablerow
        } catch (e) {
            log.debug(title + e.message, e.error);
        }

    }
    //arslan
    function mapedFieldArrayfunction(assistance) {
        var title = 'mapedFieldArrayfunction()::';
        try {
            var recStep3 = assistance.getStep({
                id: 'custpage_ab_filemap'
            });
            var middletablerowcsvHeader = recStep3.getValue({
                id: 'custpage_ab_middletablerows_csv_header'
            });
            return middletablerowcsvHeader
        } catch (e) {
            log.debug(title + e.message, e.error);
        }
    }
    function CSVDatafromSecondStep(assistance) {
        var recStep123 = assistance.getStep({
            id: 'custpage_ab_importopt'
        });
        var csvData = recStep123.getValue({
            id: 'custpage_ab_csvdata'
        });
        return csvData
    }
    function RecordType(assistance) {
        var title = 'RecordType()::';
        try {
            var recStep3 = assistance.getStep({
                id: 'custpage_ab_filemap'
            });
            var recTypelocal = recStep3.getValue({
                id: 'custpage_ab_rectypelocalstorage'
            });
            return recTypelocal
        } catch (e) {
            log.debug(title + e.message, e.error);
        }

    }
    function getSelectOption(assistance) {
        var title = 'getSelectOption()::';
        try {
            var recStep2 = assistance.getStep({
                id: 'custpage_ab_importopt'
            });
            var selectOption = recStep2.getValue({
                id: 'custpage_ab_selectoption'
            });
            return selectOption
        } catch (e) {
            log.debug(title + e.message, e.error);
        }

    }
    function internalidOBJ(assistance) {
        var title = 'internalidOBJ()::';
        try {
            var recStep3 = assistance.getStep({
                id: 'custpage_ab_filemap'
            });
            var internalid1or0 = recStep3.getValue({
                id: 'custpage_ab_internalidid'
            });
            return internalid1or0
        } catch (e) {
            log.debug(title + e.message, e.error);
        }
    }
    return {
        onRequest: onRequest
    }
});

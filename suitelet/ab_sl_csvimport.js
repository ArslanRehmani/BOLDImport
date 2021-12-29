    /**
     *@NApiVersion 2.0
    *@NScriptType Suitelet
    */
    define(['N/ui/serverWidget','N/log','N/file','N/record','../common/ab_lib_convertCSVToJson.js','N/currentRecord','N/ui/dialog','../Library/Controller.js'], function(serverWidget,log,file,record,convertCSVLIB,currentRecord,dialog,ControllerLib) {

        function onRequest(context) {
            var title = 'OnRequestSL::'

            var request = context.request;
            var response = context.response;
            var form = serverWidget.createForm({
                title : 'CSV Impot'
            });
            var recStep;
            var NetsuiteMapData;
            var csvMapData;
            
            //client Script call
        
            var assistance = serverWidget.createAssistant({
                title : 'BOLDImport Assistant'
            });
            assistance.clientScriptModulePath = '../client/ab_cs_function_csv.js';
            try {
                
            var scanUploadSTP = assistance.addStep({
                id : 'custpage_ab_scan_step',
                label : 'Scan & Upload CSV File'
            });
            var importOptSTP = assistance.addStep({
                id : 'custpage_ab_importopt',
                label : 'Import Options'
            });
            var fileMapSTP = assistance.addStep({
                id : 'custpage_ab_filemap',
                label : 'File Mapping'
            });
            var fieldMapSTP = assistance.addStep({
                id : 'custpage_ab_fieldmap',
                label : 'Field Mapping'
            });
            var saveMapSTP = assistance.addStep({
                id : 'custpage_ab_savemap',
                label : 'Save mapping & Start Import'
            });
            
            
            
            if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.NEXT || assistance.getLastAction() == serverWidget.AssistantSubmitAction.BACK){
                if(assistance.currentStep == null){
                    recStep = assistance.getStep({
                        id : 'custpage_ab_scan_step'
                    });
                    var val = recStep.getValue({
                        id: 'custpage_ab_htmlfield',
                    });
                    log.debug(title+'val',val);
                }
                log.debug('assistance.currentStep',assistance.currentStep.id);
                if(assistance.currentStep.id == "custpage_ab_filemap"){
                    var require = GetThirdStepFieldMapLengthRequire(assistance);
                    var lenghtEqual = GetThirdStepFieldMapLength(assistance);

                    if((require == 'true' || require == true) && (lenghtEqual == 'true' || lenghtEqual == true)){
                        var createRecordinArray = createRecordInnetsuite(assistance);                       
                        var mapedFieldArray = createRecordinArray;
                          mapedFieldArray = JSON.parse(mapedFieldArray);
                        var finalArray = [];
                        var NetsuiteIdArray = [];
                            for(var i=0; i<mapedFieldArray.length; i++){
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
                        var rectype = RecordType(assistance);
                        var rectypetostring = rectype.toString();
                        var csvDatArray = CSVDatafromSecondStep(assistance);
                        csvDatArray = JSON.parse(csvDatArray);
                        var CreatedRecordDataObj = {};
                        // for (var c=0 ; c<csvDatArray.length ; c++){
                        //     var firstlineobj = csvDatArray[c];
                        //     // var NetsuiteRecordCreate = record.create({
                        //     //     // type: 'customrecord_ab_payroll_mapping',
                        //     //     type: rectypetostring,
                        //     //     isDynamic: true
                        //     // });
                        //     for(var i = 0 ; i <finalArray.length;i++){
                        //         var field = finalArray[i];
                        //         var firstlineKeys = Object.keys(firstlineobj);
                        //         for(var j = 0 ; j <firstlineKeys.length ;j++){
                        //                 if(firstlineKeys[j] == field){
                        //                     // log.debug('FieldSet',field +":"+firstlineobj[firstlineKeys[j]]);
                        //                     // log.debug('NetsuiteIdArray[i]====',NetsuiteIdArray[i]);
                        //                     CreatedRecordDataObj.fieldId = NetsuiteIdArray[i];
                        //                     CreatedRecordDataObj.value = firstlineobj[firstlineKeys[j]];
                        //                     // NetsuiteRecordCreate.setValue({
                        //                     //         fieldId: NetsuiteIdArray[i],
                        //                     //         value: firstlineobj[firstlineKeys[j]]
                        //                     //     });
                                            
                        //                 }
                        //         }
                        //         log.debug({
                        //             title: 'CreatedRecordDataObj used in Class',
                        //             details: CreatedRecordDataObj
                        //         });
                                ControllerLib.recTypeSwitch(csvDatArray,finalArray,NetsuiteIdArray,rectypetostring);
                        //     }
                        //     // var recordId = NetsuiteRecordCreate.save({
                        //     //     enableSourcing: true,
                        //     //     ignoreMandatoryFields: true
                        //     // });
                            
                            
                        // }
                        // log.debug(title+'CreatedRecordDataObj-----',CreatedRecordDataObj);
                        // log.debug(title+'rectypetostring-----',rectypetostring);
                        
                
                        
                        assistance.currentStep = assistance.getNextStep(); 
                    }else{
                        var MapNotEqual = assistance.addField({
                            id: 'custpage_ab_mapnotequal',
                            type: serverWidget.FieldType.INLINEHTML,
                            label: 'Mapping Fields length not Euqal'
                        });
                        MapNotEqual.defaultValue = '<p style="color: red;">Please Select All *(require) fields and Map Equal Rows in map table</p>';
                    }
                }
                else{
                    assistance.currentStep = assistance.getNextStep();
                }
            } else if (assistance.getLastAction() == serverWidget.AssistantSubmitAction.CANCEL){
                assistance.currentStep = assistance.getStep({id : 'custpage_ab_scan_step'});
            } else if ( assistance.getLastAction() == serverWidget.AssistantSubmitAction.FINISH){
                //at the end form is submite here so perform all thinks here
                // add csv import functionalty here

                assistance.finishedHtml = 'You have Completed the BOLDImport Process';
            }

                var currentStepId = assistance.currentStep == null ? 'custpage_ab_scan_step' : assistance.currentStep.id;
                log.debug('currentStepId',currentStepId);
            var tableData = file.load({id: '../templates/boldimport_table_use.html'});
            indexPageValue = tableData.getContents();
            log.debug('Templates',indexPageValue);
                switch(currentStepId){
                    case 'custpage_ab_scan_step':
                        buildFirstStep(assistance);
                        break;

                    case 'custpage_ab_importopt':
                        buildSecondStep(assistance);
                        break; 

                    case 'custpage_ab_filemap':
                        buildThirdStep(assistance);
                        break;

                    case 'custpage_ab_fieldmap':
                        buildFourthStep(assistance);
                        break;

                    case 'custpage_ab_savemap':
                            var saveFld = assistance.addField({
                                id : 'custpage_ab_save',
                                type : serverWidget.FieldType.TEXT,
                                label : 'Your Save Mapping Here'
                            });
                        break;
                }

            response.writePage(assistance);
        } catch (error) {
            log.debug('ERROR',error.message);
        }
        }
        //First step
        function buildFirstStep(assistance){
            var title = 'buildFirstStep()::';
            var HTMLInput =     '<input  class="box__file" type="file" id="file" accept=".csv" onchange="getJsonCSV();">'
            try{
                var nameFld = assistance.addField({
                    id : 'custpage_ab_record_type',
                    type : serverWidget.FieldType.SELECT,
                    label : 'Record Type'
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
                chooseFile.defaultValue =HTMLInput;
                
                }catch(error){
                    log.error(title+error.name,error.message) 
            } 
        }
        //Second step
        function buildSecondStep(assistance){
            var title = 'buildSecondStep()::';
            try{
                var addFld = assistance.addField({
                    id : 'custpage_ab_add',
                    name: 'csv_ab_btn',
                    type : serverWidget.FieldType.RADIO,
                    label : 'ADD',
                    source :'Add'
                });
                var updateFld = assistance.addField({
                    id : 'custpage_ab_add',
                    name :'csv_ab_btn',
                    type : serverWidget.FieldType.RADIO,
                    label : 'UPDATE',
                    source :'Update'
                });
                var addUpdateFld = assistance.addField({
                    id : 'custpage_ab_add',
                    name :'csv_ab_btn',
                    type : serverWidget.FieldType.RADIO,
                    label : 'ADD OR UPDATE',
                    source :'Add_Update'
                });
                var CSVDataThirdStep = assistance.addField({
                    id: 'custpage_ab_csvdata',
                    type: serverWidget.FieldType.LONGTEXT,
                    label : 'CSV Data'
                });
                CSVDataThirdStep.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });
                log.debug({
                    title: 'CSVDataThirdStep ------->',
                    details: CSVDataThirdStep
                });
                }catch(error){
                    log.error(title+error.name,error.message) 
            } 
        }
        //Third step
        function buildThirdStep(assistance){
            var title = 'buildThirdStep()::';
            var recordFld,hideFielddata,trueData;
            try{
                recordFld = assistance.addField({
                    id : 'custpage_ab_record_type',
                    type : serverWidget.FieldType.TEXT,
                    label : 'Record Type'
                });
                recordFld.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                });
                hideFielddata = assistance.addField({
                    id : 'custpage_hidden_data_field',
                    type : serverWidget.FieldType.INLINEHTML,
                    label : 'Ns fields'
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
                var requireMapDataLength = assistance.addField({
                    id: 'custpage_ab_reuiremapdatalength',
                    type: serverWidget.FieldType.TEXT,
                    label : '*reuire'
                });
                requireMapDataLength.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                }); 
                var middletablesrow = assistance.addField({
                    id: 'custpage_ab_middletablerows',
                    type: serverWidget.FieldType.LONGTEXT,
                    label : 'Middle Table Rows'
                });
                middletablesrow.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                }); 
                var recType = assistance.addField({
                    id: 'custpage_ab_rectypelocalstorage',
                    type: serverWidget.FieldType.TEXT,
                    label : 'Record Type From Local storage'
                });
                recType.updateDisplayType({
                    displayType : serverWidget.FieldDisplayType.HIDDEN
                }); 
                
                }catch(error){
                    log.error(title+error.name,error.message) 
            } 
        }
        //Fourth step
        function buildFourthStep(assistance){
            var title = 'buildFourthStep()::';
            try{
                var filedsFld = assistance.addField({
                    id : 'custpage_ab_file',
                    type : serverWidget.FieldType.TEXT,
                    label : 'Your Fileds Mapping Here'
                });
                var table = assistance.addField({
                    id: 'custpage_ng_htmlfield',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Intelisys'
                });
                table.updateLayoutType({
                    layoutType: serverWidget.FieldLayoutType.NORMAL
                });
                table.defaultValue = indexPageValue;
                }catch(error){
                    log.error(title+error.name,error.message) 
            } 
        }

        function GetThirdStepFieldMapLength(assistance){
                var  recStep3 = assistance.getStep({
                    id : 'custpage_ab_filemap'
                });
                var MapLength = recStep3.getValue({
                    id : 'custpage_ab_truedata'
                });
            return MapLength
        }
        function GetThirdStepFieldMapLengthRequire(assistance){
            var  recStep3 = assistance.getStep({
                id : 'custpage_ab_filemap'
            });
            var require = recStep3.getValue({
                id : 'custpage_ab_reuiremapdatalength'
            });
            return require
        }
        function createRecordInnetsuite(assistance){
            var  recStep3 = assistance.getStep({
                id : 'custpage_ab_filemap'
            });
            var middletablerow = recStep3.getValue({
                id : 'custpage_ab_middletablerows'
            });
            return middletablerow
        }
        function CSVDatafromSecondStep(assistance){
            var  recStep123 = assistance.getStep({
                id : 'custpage_ab_importopt'
            });
            var csvData = recStep123.getValue({
                id : 'custpage_ab_csvdata'
            });
            return csvData
        }
        function RecordType(assistance){
            var  recStep3 = assistance.getStep({
                id : 'custpage_ab_filemap'
            });
            var recTypelocal = recStep3.getValue({
                id : 'custpage_ab_rectypelocalstorage'
            });
            return recTypelocal
        }
        return {
            onRequest: onRequest
        }
    });

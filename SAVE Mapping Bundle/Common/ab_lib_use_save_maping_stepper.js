define(['N/log','N/record', 'N/ui/serverWidget', 'N/search'], 
function (log,record, serverWidget, search) {
    return {
        buildFirstStep: function (assistance) {
            var title = 'buildFirstStep()::';
            var HTMLInput = '<input  class="box__file" type="file" id="file" accept=".csv" onchange="getJsonCSV();">'
            try {
                var nameFld = assistance.addField({
                    id: 'custpage_ab_record_type',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Record Type'
                });
                nameFld.isMandatory = true;
                nameFld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.DISABLED
                });
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
        },
        buildSecondStep: function (assistance) {
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
                var CSVDataThirdStep = assistance.addField({
                    id: 'custpage_ab_csvdata',
                    type: serverWidget.FieldType.LONGTEXT,
                    label: 'CSV Data'
                });
                CSVDataThirdStep.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var selectOption = assistance.addField({
                    id: 'custpage_ab_selectoption',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Select Option'
                });
                selectOption.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var uploadedCsvFileName = assistance.addField({
                    id: 'custpage_ab_csvfile_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'CSV File Name'
                });
                uploadedCsvFileName.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var uploadedCsvFileData = assistance.addField({
                    id: 'custpage_ab_csvfile_data',
                    type: serverWidget.FieldType.TEXT,
                    label: 'CSV File Data'
                });
                uploadedCsvFileData.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var savedMappingRecID = assistance.addField({
                    id: 'custpage_ab_save_mapping_rec_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Save Mapping Rec ID'
                });
                savedMappingRecID.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

            } catch (error) {
                log.error(title + error.name, error.message)
            }
        },
        buildThirdStep: function (assistance) {
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
                var middletablesrow = assistance.addField({
                    id: 'custpage_ab_middletablerows',
                    type: serverWidget.FieldType.LONGTEXT,
                    label: 'Middle Table Rows'
                });
                middletablesrow.updateDisplayType({
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
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                var CSVremainngFields = assistance.addField({
                    id: 'custpage_ab_csvremainingfields',
                    type: serverWidget.FieldType.TEXT,
                    label: 'CSV Remaining Fields'
                });
                CSVremainngFields.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });

            } catch (error) {
                log.error(title + error.name, error.message)
            }
        },
        buildFourthStep: function (assistance, mapReduceRecordRecType) {
            var title = 'buildFourthStep()::';
            try {
                var refreshBtn = assistance.addField({
                    id: 'custpage_ab_refreshbtn',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Refresh Button'
                });
                refreshBtn.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.NORMAL
                });
                var htmlBtnData = '<style>\
                input#refreshBtn {\
                    padding: 5px 10px;\
                    background: #2080f4;\
                    color: #fff;\
                    font-weight: 600;\
                    border-radius: 3px;\
                }\
                button#refreshButton {\
                    padding: 5px 10px;\
                    background: #2080f4;\
                    color: #fff;\
                    font-weight: 600;\
                    border-radius: 3px;\
                    border: none;\
                    float: left;\
                }\
                </style>';
                htmlBtnData += '<input type="button" onClick="RefreshMapReduceRec();"  id= "refreshBtn" value="View CSV Import" style="cursor:pointer" />';
                htmlBtnData += '<SCRIPT language="JavaScript" type="text/javascript">';
                htmlBtnData += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
                htmlBtnData += 'bindEvent(window, "load", function(){';
                htmlBtnData += 'window.RefreshMapReduceRec = function (event){window.open("/app/common/custom/custrecordentrylist.nl?rectype='+mapReduceRecordRecType+'")}';
                htmlBtnData += '});';
                htmlBtnData += '</SCRIPT>';
                refreshBtn.defaultValue = htmlBtnData;
                var mapReduceScriptBtn = assistance.addField({
                    id: 'custpage_ab_refreshbtn12',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Refresh Button12'
                });
                mapReduceScriptBtn.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.NORMAL
                });
                var HtmlData = '<button id="refreshButton" onclick="myFunction()">Refresh This Page to see Import Status</button>';
                HtmlData += '<script>\
                function myFunction() {\
                    location.reload();\
                }\
                </script>';
                mapReduceScriptBtn.defaultValue = HtmlData;

                //new Code 
                var mapReduceImportStatus = assistance.addField({
                    id: 'custpage_ab_mapreduceimportstatus',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'MapReduce Import Status'
                });
                mapReduceImportStatus.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.NORMAL
                });
                mapReduceImportStatus.defaultValue = '<h1 style="color: green;">MapReduce Import Status</h1>';
                var customrecord_ab_mr_record_statusSearchObj = search.create({
                    type: "customrecord_ab_mr_record_status",
                    filters:
                        [
                            ["created", "within", "today"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "custrecord_ab_mr_status_mr_id", label: "Map Reduce ID" }),
                            search.createColumn({
                                name: "internalid",
                                sort: search.Sort.DESC,
                                label: "Internal ID"
                            })
                        ]
                });
                var results = customrecord_ab_mr_record_statusSearchObj.run().getRange({
                    start: 0,
                    end: 1
                });
                var mapReduceStatusId = results[0].getValue({ name: 'custrecord_ab_mr_status_mr_id' });
                log.debug({
                    title: 'mapReduceStatusId123',
                    details: mapReduceStatusId
                });
                //Current Status of MapReduce Import 
                var currentStatus;
                var RecordID;
                var scheduledscriptinstanceSearchObj = search.create({
                    type: "scheduledscriptinstance",
                    filters:
                        [
                            ["taskid", "contains", mapReduceStatusId]
                        ],
                    columns:
                        [
                            search.createColumn({
                                name: "datecreated",
                                sort: search.Sort.ASC,
                                label: "Date Created"
                            }),
                            search.createColumn({ name: "startdate", label: "Start Date" }),
                            search.createColumn({ name: "enddate", label: "End Date" }),
                            search.createColumn({ name: "queue", label: "Queue" }),
                            search.createColumn({ name: "status", label: "Status" }),
                            search.createColumn({ name: "mapreducestage", label: "Map/Reduce Stage" }),
                            search.createColumn({ name: "percentcomplete", label: "Percent Complete" }),
                            search.createColumn({ name: "queueposition", label: "Queue Position" })
                        ]
                });
                scheduledscriptinstanceSearchObj.run().each(function (result) {
                    currentStatus = result.getValue({ name: 'status' });
                    RecordID = results[0].id;
                    return true;
                });
                log.debug({
                    title: 'currentStatus 123',
                    details: currentStatus
                });
                if (currentStatus == "Complete") {
                    mapReduceImportStatus.defaultValue = '<h1 style="color: green;">MapReduce Import Status: ' + currentStatus + '</h1>';
                    var mapReduceRecObj = record.load({
                        type: 'customrecord_ab_mr_record_status',
                        id: parseInt(RecordID)
                    });
                    mapReduceRecObj.setValue({
                        fieldId: 'custrecord_ab_mr_status_mr_summary',
                        value: 'COMPLETE'
                    });
                    mapReduceRecObj.save();
                } else {
                    mapReduceImportStatus.defaultValue = '<h1 style="color: green;">MapReduce Import Status: ' + currentStatus + '....</h1>';
                }
                // end New Code
            } catch (error) {
                log.error(title + error.name, error.message)
            }
        }
    }
});
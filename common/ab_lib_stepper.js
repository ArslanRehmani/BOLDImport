define(['N/log','N/record', 'N/ui/serverWidget', 'N/url', 'N/task', 'N/search'], function (log,record, serverWidget, url, task, search) {
    return {
        fields: {
            stepId: 'custpage_ab_filemap'
        },
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
                var LineLevelData = assistance.addField({
                    id: 'custpage_ab_line_level_data',
                    type: serverWidget.FieldType.LONGTEXT,
                    label: 'Middle Table Rows'
                });
                LineLevelData.updateDisplayType({
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
                    displayType: serverWidget.FieldDisplayType.HIDDEN
                });
                log.debug({
                    title: 'InternalIDUpdate ------->',
                    details: InternalIDUpdate
                });

            } catch (error) {
                log.error(title + error.name, error.message)
            }
        },
        buildFourthStep: function (assistance, msg) {
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
                input#errorBtn {\
                    padding: 5px 10px;\
                    background: #999999;\
                    color: #fff;\
                    font-weight: 600;\
                    border-radius: 3px;\
                }\
                input#refreshBtn {\
                    padding: 5px 10px;\
                    background: #2080f4;\
                    color: #fff;\
                    font-weight: 600;\
                    border-radius: 3px;\
                }\
                </style>';
                htmlBtnData += '<input type="button" onClick="RefreshMapReduceRec();"  id= "refreshBtn" value="View" style="cursor:pointer" /> <input type="button" id="errorBtn" onclick="ViewError(event)" title="ViewErrorViewError" value="View Errors" style="cursor:pointer" />';
                htmlBtnData += '<SCRIPT language="JavaScript" type="text/javascript">';
                htmlBtnData += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
                htmlBtnData += 'bindEvent(window, "load", function(){';
                htmlBtnData += 'window.RefreshMapReduceRec = function (event){window.open("/app/common/custom/custrecordentrylist.nl?rectype=1507&amp;searchtype=Custom&searchid=3092&amp;style=NORMAL&amp;sortcol=Custom_CREATED_raw&amp;sortdir=DESC&amp;csv=HTML&amp;OfficeXML=F&amp;pdf=&amp;size=50&amp;_csrf=RNXxNUhg0W18IDbMDv4PomgNC4a8EWVwYrEDVdbw-wyF9LOrvqlKzaYoPWQ-gkFC6c72hheWoOgeX3RPMogkb6MQMhCEEm0ejN4U1HUk1k_WJK_xH8PDOCiis1UOiQb2DwVfJWrgBm0F9GO-oxl7b8wzNAKzUGfkFnG4qN4Obf4%3D&amp;twbx=F&amp;report=&amp;grid=&amp;dle=&amp;showall=F&amp;quicksort=Custom_CREATED_raw%20DESC")}';
                htmlBtnData += '});';
                htmlBtnData += '</SCRIPT>';
                refreshBtn.defaultValue = htmlBtnData;
                var filedsFld = assistance.addField({
                    id: 'custpage_ab_file',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Records Successfully Created'
                });
                filedsFld.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.NORMAL
                });
                // filedsFld.defaultValue = '<h1 style="color: green;">' + msg + '</h1>';
                filedsFld.defaultValue = '<h1 style="color: green;">Click VIEW to See Import Record Status/Logs</h1>';
                //my Code for refresh btn
                /*var htmlBtnData = '<br /> <br /><input type="button" onClick="RefreshMapReduceRec();"  id= "refreshrec" value="Refresh Button" style="cursor:pointer" />';
                            htmlBtnData += '<SCRIPT language="JavaScript" type="text/javascript">';
                            htmlBtnData += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
                            htmlBtnData += 'bindEvent(window, "load", function(){';
                            htmlBtnData += 'window.RefreshMapReduceRec = function (event){window.open("/app/common/custom/custrecordentrylist.nl?rectype=1507&amp;searchtype=Custom&searchid=3092&amp;style=NORMAL&amp;sortcol=Custom_CREATED_raw&amp;sortdir=DESC&amp;csv=HTML&amp;OfficeXML=F&amp;pdf=&amp;size=50&amp;_csrf=RNXxNUhg0W18IDbMDv4PomgNC4a8EWVwYrEDVdbw-wyF9LOrvqlKzaYoPWQ-gkFC6c72hheWoOgeX3RPMogkb6MQMhCEEm0ejN4U1HUk1k_WJK_xH8PDOCiis1UOiQb2DwVfJWrgBm0F9GO-oxl7b8wzNAKzUGfkFnG4qN4Obf4%3D&amp;twbx=F&amp;report=&amp;grid=&amp;dle=&amp;showall=F&amp;quicksort=Custom_CREATED_raw%20DESC")}';
                            htmlBtnData += '});';
                            htmlBtnData += '</SCRIPT>';*/
                var mapReduceScriptBtn = assistance.addField({
                    id: 'custpage_ab_refreshbtn12',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Refresh Button12'
                });
                mapReduceScriptBtn.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.NORMAL
                });
                // var htmlData = '<input type="button" onClick="StatusMapReduceRec();"  id= "refreshrec" value="Map Reduce Status" style="cursor:pointer" />';
                //             htmlData += '<SCRIPT language="JavaScript" type="text/javascript">';
                //             htmlData += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
                //             htmlData += 'bindEvent(window, "load", function(){';
                //             htmlData += 'window.StatusMapReduceRec = function (event){window.alert("helo")}';
                //             htmlData += '});';
                //             htmlData += '</SCRIPT>';
                //             mapReduceScriptBtn.defaultValue = htmlData;
                var HtmlData = '<button onclick="myFunction()">Refresh This Page to see Import Status</button>';
                HtmlData += '<script>\
                function myFunction() {\
                    location.reload();\
                }\
                </script>';
                mapReduceScriptBtn.defaultValue = HtmlData;
                // var mapReduce = task.create({
                //     taskType: task.TaskType.MAP_REDUCE,
                //     scriptId: 'customscript_ab_mr_update_maprec_status',
                //     deploymentId: 'customdeploy_ab_mr_update_maprec_status'
                // });
                // var mapReduceId = mapReduce.submit();
                // log.debug({
                //     title: 'mapReduceId',
                //     details: mapReduceId
                // });


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
        },
        callMapReduceStep: function (assistance) {
            var title = 'callMapReduceStep()::';
            try {
                var refreshBtn = assistance.addField({
                    id: 'custpage_ab_refreshbtn123',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Refresh Button123'
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
                </style>';
                htmlBtnData += '<input type="button" onClick="RefreshMapReduceRec();"  id= "refreshBtn" value="View Import Status" style="cursor:pointer" />';
                htmlBtnData += '<SCRIPT language="JavaScript" type="text/javascript">';
                htmlBtnData += "function bindEvent(element, type, handler) {if(element.addEventListener) {element.addEventListener(type, handler, false);} else {element.attachEvent('on'+type, handler);}} ";
                htmlBtnData += 'bindEvent(window, "load", function(){';
                htmlBtnData += 'window.RefreshMapReduceRec = function (event){window.open("/app/common/custom/custrecordentrylist.nl?rectype=1507&amp;searchtype=Custom&searchid=3092&amp;style=NORMAL&amp;sortcol=Custom_CREATED_raw&amp;sortdir=DESC&amp;csv=HTML&amp;OfficeXML=F&amp;pdf=&amp;size=50&amp;_csrf=RNXxNUhg0W18IDbMDv4PomgNC4a8EWVwYrEDVdbw-wyF9LOrvqlKzaYoPWQ-gkFC6c72hheWoOgeX3RPMogkb6MQMhCEEm0ejN4U1HUk1k_WJK_xH8PDOCiis1UOiQb2DwVfJWrgBm0F9GO-oxl7b8wzNAKzUGfkFnG4qN4Obf4%3D&amp;twbx=F&amp;report=&amp;grid=&amp;dle=&amp;showall=F&amp;quicksort=Custom_CREATED_raw%20DESC")}';
                htmlBtnData += '});';
                htmlBtnData += '</SCRIPT>';
                refreshBtn.defaultValue = htmlBtnData;
                var mapReduce = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ab_mr_update_maprec_status',
                    deploymentId: 'customdeploy_ab_mr_update_maprec_status'
                });
                var mapReduceId = mapReduce.submit();
                log.debug({
                    title: 'mapReduceId',
                    details: mapReduceId
                });
            } catch (error) {
                log.error(title + error.name, error.message)
            }
        },
    }
});
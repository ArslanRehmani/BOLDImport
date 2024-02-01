/**
 *@NApiVersion 2.0
*@NScriptType ClientScript
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
 * File:		ab_cs_use_save_mapping.js
 * Date:		01/01/2022
 * 
 ***********************************************************************/
define(['N/url', 'N/currentRecord', '../class/ab_CLS_boldImportRecords.js', '../Common/ab_lib_convertCSVToJson.js', '../Common/ab_lib_common.js', '../Common/ab_lib_cs_fun.js'],
    function (nsUrl, currentRecord, importRecordCLS, convertCSVLIB, commonLib, csFunLib) {

        function pageInit(context) {
            var title = 'pageInit(::)';
            try {
                selectRecTypeToImportCvs(context);
                window.swapRow = swapRow;
                window.hideLineItems = hideLineItems;
                window.getJsonCSV = getJsonCSV;
                var headerFields, record, recTypeFromURL, recIdFromURL, recordField, csvdata, UploadFileName, UploadFileCSVdata,
                    saveMappedRecFieldData;

                record = currentRecord.get();

                //Save Mapping URL get recType START
                recTypeFromURL = getDataFromURL('recType');
                if (recTypeFromURL) {
                    window.nlapiSetFieldValue('custpage_ab_record_type', recTypeFromURL);
                }
                //Save Mapping URL get recType END

                //set both table length true if no others fields are map 
                // meaning no body or line level fields selected so we suppose to use previous save mapping obj
                record.setValue({
                    fieldId: 'custpage_ab_truedata',
                    value: true,
                    ignoreFieldChange: true
                });
                // var recordField = 'customrecord_ab_payroll_mapping';
                recordField = localStorage.getItem('recscan');
                //set value in second step so that we can create record with repective record type
                record.setValue({
                    fieldId: 'custpage_ab_rectypelocalstorage',
                    value: recordField
                });

                UploadFileName = localStorage.getItem('UploadFileName');
                if (UploadFileName) {
                    record.setValue({
                        fieldId: 'custpage_ab_csvfile_name',
                        value: UploadFileName
                    });
                }

                UploadFileCSVdata = localStorage.getItem('UploadFileCSVdata');
                if (UploadFileCSVdata) {
                    record.setValue({
                        fieldId: 'custpage_ab_csvfile_data',
                        value: UploadFileCSVdata
                    });
                }

                csvdata = localStorage.getItem('csvData');
                if (csvdata) {
                    var csv_json = JSON.parse(csvdata);
                    record.setValue({
                        fieldId: 'custpage_ab_csvdata',
                        value: csvdata
                    });
                    if (csv_json.length) {
                        headerFields = Object.keys(csv_json[0]);
                        console.log("headerFields()()", headerFields);
                    }
                }

                //Save Mapping URL get recid START
                recIdFromURL = getDataFromURL('recid');
                var useSaveMappingRecID = recIdFromURL.replace(/\+/g, '');
                if (useSaveMappingRecID) {
                    localStorage.setItem('useSaveMappingRecID', useSaveMappingRecID);
                }
                var saveMappingRecID = localStorage.getItem('useSaveMappingRecID');
                //set save mapping recid in Field second step
                if (saveMappingRecID) {
                    record.setValue({
                        fieldId: 'custpage_ab_save_mapping_rec_id',
                        value: saveMappingRecID
                    });
                }
                //Save Mapping URL get recid END

                if (saveMappingRecID) {
                    saveMappedRecFieldData = window.nlapiLookupField('customrecord_ab_maped_record', parseInt(saveMappingRecID), 'custrecord_ab_maped_record_field');
                    var savedMappingOBJ = JSON.parse(saveMappedRecFieldData);
                    var bodyFields = savedMappingOBJ.bodyFields;
                    var lineFields = savedMappingOBJ.LineFields;
                    // use above recordField as well to scan which record type is selected for Import
                    // this recordField also get value from saveMapping record 
                    recordField = window.nlapiLookupField('customrecord_ab_maped_record', parseInt(saveMappingRecID), 'custrecord_create_rec_type');
                    console.log("recordField", recordField);
                    if (recordField) {
                        var recordFields = csFunLib.getRecordFields(recordField);
                        if (recordFields.bodyfields.length) {
                            var html = '<!DOCTYPE html>\
                                <html lang="en">\
                                <head>\
                                <meta charset="utf-8">\
                                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">\
                                <title></title>\
                                <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">\
                                <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css">\
                                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">\
                                <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">\
                                <script src="https://code.jquery.com/jquery-3.6.1.min.js"></script>\
                                <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js"></script>\
                                <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>\
                                <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>\
                                <style>\
                                body {\
                                    color: #404E67;\
                                    background: #F5F7FA;\
                                    font-family: "Open Sans", sans-serif;\
                                }\
                                .table-wrapper {\
                                    margin: 20px auto;\
                                    background: #fff;\
                                    box-shadow: 0 1px 1px rgba(0,0,0,.05);\
                                }\
                                .table-title {\
                                    padding-bottom: 10px;\
                                }\
                                .table-title h2 {\
                                    font-size: 22px;\
                                    align :center;\
                                }\
                                .table-title .add-new {\
                                    float: right;\
                                    height: 30px;\
                                    font-weight: bold;\
                                    font-size: 12px;\
                                    text-shadow: none;\
                                    min-width: 100px;\
                                    border-radius: 50px;\
                                    line-height: 13px;\
                                }\
                                .table-title .add-new i {\
                                    margin-right: 4px;\
                                }\
                                table.table {\
                                    table-layout: fixed;\
                                }\
                                table.table tr th, table.table tr td {\
                                    border-color: #e9e9e9;\
                                }\
                                table.table th i {\
                                    font-size: 13px;\
                                    margin: 0 5px;\
                                    cursor: pointer;\
                                }\
                                table.table th:last-child {\
                                    width: 100px;\
                                }\
                                table.table td a {\
                                    cursor: pointer;\
                                    display: inline-block;\
                                    margin: 0 5px;\
                                    min-width: 24px;\
                                }\
                                table.table td a.add {\
                                    color: #27C46B;\
                                }\
                                table.table td a.edit {\
                                    color: #FFC107;\
                                }\
                                table.table td a.delete {\
                                    color: #E34724;\
                                }\
                                table.table td i {\
                                    font-size: 19px;\
                                }\
                                table.table td a.add i {\
                                    font-size: 24px;\
                                    margin-right: -1px;\
                                    position: relative;\
                                    top: 3px;\
                                }\
                                table.table .form-control {\
                                    height: 32px;\
                                    line-height: 32px;\
                                    box-shadow: none;\
                                    border-radius: 2px;\
                                }\
                                table.table .form-control.error {\
                                    border-color: #f50000;\
                                }\
                                table.table td .add {\
                                    display: none;\
                                }\
                                #right-Float {\
                                float: right;\
                                }\
                                #left-Float {\
                                float: left;\
                                }\
                                span#custpage_hidden_data_field_val {\
                                    width: 100%;\
                                    float: left;\
                                }\
                                table.uir-fieldarrangement-fieldwraptable {\
                                    width: 100%;\
                                    /* float: left; */\
                                }\
                                .container-lg {\
                                    max-width: 100% !important;\
                                    float: left;\
                                }\
                                .container-lg {\
                                    max-width: 100% !important;\
                                    width: 100%;\
                                }\
                                .w-100{\
                                    width:100%;\
                                }\
                                .contect-height{\
                                    height: 40px;\
                                    overflow: hidden;\
                                    display: flex;\
                                    align-items: center;\
                                }\
                                .padding-right{\
                                    padding-right:5px;\
                                }\
                                .a-display{\
                                    width: 100%;\
                                    display: inline-block;\
                                }\
                                .padding-0{\
                                    padding: 0px !important;\
                                }\
                                .padding-75{\
                                    padding: .75rem;\
                                }\
                                .slideme.padding-75 {\
                                    border-bottom: 1px solid #e9e9e9;\
                                    border-collapse: collapse;\
                                }\
                                .border-none{\
                                    border:0px !important;\
                                }\
                                .align-center{\
                                    text-align: center;\
                                }\
                                #CSVtblMap .fields {\
                                    text-align: right;\
                                }\
                                .icon i {\
                                    font-size: 12px !important;\
                                }\
                                table#NetSuitetbl .right-icon {\
                                    display: none;\
                                }\
                                table#NetSuitetblMap .left-icon {\
                                    display: none;\
                                }\
                                .right-icon {\
                                    position: absolute;\
                                    right: 0;\
                                }\
                                .close-icon {\
                                    position: absolute;\
                                    left: 0;\
                                }\
                                .position-relative{\
                                    position: relative;\
                                }\
                                table#CSVtbl .close-icon {\
                                    display: none;\
                                }\
                                table#CSVtblMap .right-icon {\
                                    display: none;\
                                }\
                                .bg-color{\
                                    background: #607799;\
                                    color: #fff;\
                                }\
                                .font-italic{\
                                    font-style: italic;\
                                }\
                                #CSVmapTblBody .csvtdicon{\
                                    display:none;\
                                }\
                                #CSVtblBody .csvtdicon{\
                                    display:block;\
                                }\
                                #NetSuiteTblBody .nstdicon{\
                                    display:block;\
                                }\
                                #NetSuitemapTblBody .nstdicon{\
                                    display:none;\
                                }\
                                #NetSuiteTblBody .nsmaptd{\
                                    display:none;\
                                }\
                                #NetSuitemapTblBody .nsmaptd{\
                                    display:block;\
                                }\
                                @media screen and (max-width: 1704px) {\
                                    h2 {\
                                    font-size: 17px !important;\
                                    }\
                                }\
                                </style>\
                                </head>\
                                <body>\
                                <form>\
                    <div class="container-lg">\
                        <div id="right-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 100%; padding-left:20px;">\
                                <div class="table-title">\
                                    <div class="w-100">\
                                        <div><h2>NetSuite Record</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered my_table" id= "NetSuitetbl" >\
                                    <thead>\
                                        <tr>\
                                            <th class="bg-color">NetSuite Field Name</th>\
                                        </tr>\
                                        <tr hideRow>\
                                        <th><a onclick="hideLineItems(event)" title="Hide/Show Item" data-toggle="collapse" data-target=".demo1" class="accordion-toggle"><b>Double Click Hide/show Item Sublist</b></a></th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "NetSuiteTblBody" >';
                            if (recordFields.sublistFields.item) {
                                if (recordFields.sublistFields.item.length > 0) {
                                    var updatedSubList = recordFields.sublistFields.item.filter(function (subListItems) {
                                        return !lineFields.some(function (itemLine) {
                                            return subListItems.id === itemLine.NSField;
                                        });
                                    });
                                    for (var i = 0; i <= updatedSubList.length - 1; i++) {
                                        var datarec = updatedSubList[i];
                                        if (recordField == "workorder") {
                                            continue;
                                        }
                                        html += '<tr class="hideTr">\
                                                <td class = "fields padding-0 border-none" data-id = "'+ datarec.id + '" linename = "' + datarec.name + '"  name = "' + 'Line ' + datarec.name + '">\
                                                <div class="slideme padding-75" style="display: none; padding-left:40px;">\
                                                    <a onclick="swapRow(event)" title="'+ datarec.name + '" class="a-display font-italic">\
                                                        <div class="contect-height position-relative">\
                                                            <span class="padding-right left-icon icon"><i class="fa fa-arrow-left"></i>\
                                                            </span>' + " <span> <strong>lineItem : </strong> </span>" + datarec.name + '\
                                                            <span class="padding-right right-icon icon"><i class="fa fa-times"></i></span>\
                                                        </div>\
                                                    </a>\
                                                    </div>\
                                                </td>\
                                            </tr>'
                                    }
                                }
                            }
                            var updatedBodyFieldsLIst = recordFields.bodyfields.filter(function (bdyFields) {
                                return !bodyFields.some(function (itemLine) {
                                    return bdyFields.id === itemLine.NSField;
                                });
                            });
                            for (var p = 0; p <= updatedBodyFieldsLIst.length - 1; p++) {
                                var datarec = updatedBodyFieldsLIst[p];
                                html += '<tr>\
                                        <td class = "fields" data-id = "'+ datarec.id + '" name = "' + datarec.name + '"><a onclick="swapRow(event)" title="' + datarec.name + '" class="a-display"><div class="contect-height position-relative"><span class="padding-right left-icon icon"><i class="fa fa-arrow-left"></i></span>' + datarec.name + '<span class="padding-right right-icon icon"><i class="fa fa-times"></i></span></div></a></td>\
                                        </tr>'
                            }

                            html += '</tbody>\
                                </table>\
                            </div>\
                        </div>\
                        <div id="right-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 100%; padding-right:20px;">\
                                <div class="table-title">\
                                    <div class="w-100">\
                                        <div class="align-center"><h2>NetSuite Record Mapping</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered" id= "NetSuitetblMap" >\
                                    <thead>\
                                        <tr>\
                                            <th class="bg-color">NetSuite Field Map</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "NetSuitemapTblBody">';
                            //NetSuite Saved Map fields show here
                            if (bodyFields.length > 0) {
                                for (var k = 0; k <= bodyFields.length - 1; k++) {
                                    var NSField = bodyFields[k]['NSField'];
                                    // var csvData = bodyfieldsOBJ['csvField'];
                                    html += '<tr>\
                                                    <td class = "fields" data-id = "'+ NSField + '" name = "NSField">\
                                                        <a onclick="swapRow(event)" title="'+ NSField + '" class="a-display">\
                                                            <div class="contect-height position-relative">\
                                                            <span class="nstdicon"><i class="fa fa-arrow-left" style="font-size:12px"></i></span>\
                                                            <span class="w-100">&nbsp;' + NSField + '</span>\
                                                            <span class="nsmaptd"><i class="fa fa-times" style="font-size:12px"></i></span>\
                                                            </div>\
                                                        </a>\
                                                    </td>\
                                                </tr>'
                                }
                            }
                            if (lineFields.length > 0) {
                                for (var l = 0; l <= lineFields.length - 1; l++) {
                                    var NSField1 = lineFields[l]['NSField'];
                                    // var csvData1 = linefieldOBJ['csvField'];
                                    html += '<tr>\
                                                    <td class = "fields" data-id = "'+ NSField1 + '" name = "NSField1">\
                                                        <a onclick="swapRow(event)" title="'+ NSField1 + '" class="a-display">\
                                                            <div class="contect-height position-relative">\
                                                            <span class="nstdicon"><i class="fa fa-arrow-left" style="font-size:12px"></i></span>\
                                                            <span class="w-100">' + NSField1 + '</span>\
                                                            <span class="nsmaptd"><i class="fa fa-times" style="font-size:12px"></i></span>\
                                                            </div>\
                                                        </a>\
                                                    </td>\
                                                </tr>'
                                }
                            }
                            html += '</tbody>\
                                </table>\
                            </div>\
                        </div>\
                        <div id="left-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 100%; padding-right:20px;">\
                                <div class="table-title">\
                                    <div class="w-100">\
                                        <div><h2>CSV Record</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered" id= "CSVtbl" >\
                                    <thead>\
                                        <tr>\
                                            <th class="bg-color">CSV Field Name</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "CSVtblBody">';
                            var excludedFields = savedMappingOBJ.bodyFields.concat(savedMappingOBJ.LineFields).map(function (field) {
                                return field.csvField;
                            });
                            var updatedHeaderField = headerFields.filter(function (field) {
                                return !excludedFields.includes(field);
                            });
                            for (var x = 0; x <= updatedHeaderField.length - 1; x++) {
                                var headerField = updatedHeaderField[x];
                                html += '<tr>\
                                                <td class = "fields" data-id = "'+ headerField + '" name = "headerField">\
                                                    <a onclick="swapRow(event)" title="'+ headerField + '" class="a-display">\
                                                        <div class="contect-height position-relative">\
                                                        <span class="w-100">' + headerField + '</span>\
                                                        <span class="padding-right right-icon icon"><i class="fa fa-arrow-right"></i></span>\
                                                        <span class="padding-right close-icon icon"><i class="fa fa-times"></i></span>\
                                                        </div>\
                                                    </a>\
                                                </td>\
                                            </tr>'
                            }
                            html += '</tbody>\
                                </table>\
                            </div>\
                        </div>\
                        <div id="left-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 100%; padding-left:20px;">\
                                <div class="table-title">\
                                    <div class="w-100">\
                                        <div class="align-center"><h2>CSV Record Mapping</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered" id= "CSVtblMap" >\
                                    <thead>\
                                        <tr>\
                                            <th class="bg-color">CSV Field Map</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "CSVmapTblBody">';
                            //CSV Saved Map fields show here
                            if (bodyFields.length > 0) {
                                for (var f = 0; f <= bodyFields.length - 1; f++) {
                                    var csvData = bodyFields[f]['csvField'];
                                    html += '<tr>\
                                                    <td class = "fields" data-id = "'+ csvData + '" name = "CSVFields">\
                                                        <a onclick="swapRow(event)" title="'+ csvData + '" class="a-display">\
                                                            <div class="contect-height position-relative">\
                                                            <span class="w-100">' + csvData + '</span>\
                                                            <span class="padding-right close-icon icon"><i class="fa fa-times"></i></span>\
                                                            <span class="csvtdicon"><i class="fa fa-arrow-right" style="font-size:12px"></i></span>\
                                                            </div>\
                                                        </a>\
                                                    </td>\
                                                </tr>'
                                }
                            }
                            if (lineFields.length > 0) {
                                for (var d = 0; d <= lineFields.length - 1; d++) {
                                    var csvData1 = lineFields[d]['csvField'];
                                    html += '<tr>\
                                                    <td class = "fields" data-id = "'+ csvData1 + '" name = "CSVFields">\
                                                        <a onclick="swapRow(event)" title="'+ csvData1 + '" class="a-display">\
                                                            <div class="contect-height position-relative">\
                                                            <span class="w-100">' + csvData1 + '</span>\
                                                            <span class="padding-right close-icon icon"><i class="fa fa-times"></i></span>\
                                                            <span class="csvtdicon"><i class="fa fa-arrow-right" style="font-size:12px"></i></span>\
                                                            </div>\
                                                        </a>\
                                                    </td>\
                                                </tr>'
                                }
                            }
                            html += '</tbody>\
                                </table>\
                            </div>\
                        </div>\
                    </div>\
                    </form>\
                                </body >\
                                </html > ';
                        }
                    }
                }
                window.nlapiSetFieldValue('custpage_hidden_data_field', html);
                // window.getJsonCSV = convertCSVLIB.getJsonCSV;
                // window.csvJSON = convertCSVLIB.csvJSON;
            } catch (e) {
                console.log('Exception', e.message);
                log.debug('Exception ' + title, e.message);
            }
        }
       function getJsonCSV(file) {
            var self = this;
            var fileUpload = document.getElementById("file");
            if (!file) {
                file = fileUpload.files[0];
            } else {
                file = file[0];
            }
            localStorage.setItem("UploadFileName", file.name);
            var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv)$/;
            if (regex.test(file.name.toLowerCase())) {
                if (typeof (FileReader) != "undefined") {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var data = e.target.result;
                        // console.log('dataCSSV', data);
                        localStorage.setItem("UploadFileCSVdata", data);
                        csvJSON(data);
                    };
                    reader.readAsText(file);
                } else {
                    alert("This browser does not support HTML5.");
                }
            } else {
                alert("Please upload a valid CSV file.");
            }
            return false;
        }
        function csvJSON(csv) {
            var lines = csv.split("\r");
            var result = [];
            // NOTE: If your columns contain commas in their values, you'll need
            // to deal with those before doing the next step
            // (you might convert them to &&& or something, then covert them back later)
            // jsfiddle showing the issue https://jsfiddle.net/
            var headers = lines[0].split(",");
            for (var i = 1; i < lines.length; i++) {
                var obj = {};
                var currentline = lines[i].replace('\n', '').split(",");
                for (var j = 0; j < headers.length; j++) {
                    if (headers[j] && currentline[j]) {
                        obj[headers[j]] = currentline[j];
                    }
                }
                if (Object.keys(obj).length) {
                    result.push(obj);
                }
            }
            if (result.length) {
                localStorage.setItem("csvData", JSON.stringify(result));
                console.log('***result***', result);
            } else {
                alert('Selected CSV File is empty');
                jQuery('#file').val('');
                throw new Error('Selected CSV File is empty');
            }
            //return result; //JavaScript object
            return JSON.stringify(result); //JSON
        }
        /** 
         * This function show the records list which suppose to be impport 
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @return null 
         * 
        */
        function selectRecTypeToImportCvs(context) {
            var title = 'selectRecTypeToImportCvs(::)';
            try {
                var record = currentRecord.get();
                var importRecords = importRecordCLS.getList();
                var importRec = record.getField('custpage_ab_record_type');
                if (!!importRec) {
                    importRec.removeSelectOption({
                        value: null
                    });
                    importRec.insertSelectOption({
                        value: '',
                        text: 'please select record type',
                        isSelected: true
                    });
                    if (importRecords.length != 0) {
                        for (var i in importRecords) {
                            importRec.insertSelectOption({
                                value: importRecords[i].value,
                                text: importRecords[i].text
                            });
                        }
                    }
                }
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }

        function fieldChanged(context) {
            var title = 'fieldChanged(::)';
            try {
                var rec = currentRecord.get();
                var netsuitedata, csvmapdata, fieldId, selectedRecordForImport, selectAddUpdate, selectOption;

                netsuitedata = jQuery('#NetSuitetblMap .fields').length;
                csvmapdata = jQuery('#CSVtblMap .fields').length;

                if (netsuitedata == csvmapdata) {
                    rec.setValue({
                        fieldId: 'custpage_ab_truedata',
                        value: true,
                        ignoreFieldChange: true
                    });
                } else {
                    rec.setValue({
                        fieldId: 'custpage_ab_truedata',
                        value: false,
                        ignoreFieldChange: true
                    });
                }

                fieldId = context.fieldId;
                selectedRecordForImport = rec.getValue({
                    fieldId: 'custpage_ab_record_type'
                });
                if (fieldId == 'custpage_ab_record_type') {
                    if (selectedRecordForImport != null) {
                        localStorage.setItem('recscan', selectedRecordForImport);
                    }
                }

                selectAddUpdate = jQuery('input[name="custpage_ab_add"]:checked').val();
                localStorage.setItem('selectoption', selectAddUpdate);

                selectOption = localStorage.getItem('selectoption');
                if (fieldId == 'custpage_ab_add') {
                    rec.setValue({
                        fieldId: 'custpage_ab_selectoption',
                        value: selectOption
                    });
                }

            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        /** 
         * This function dynamically move rows from one table to another also call two more function serializeData() AND fieldChanged(rec)
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @param [event] e
         * @return null 
         * 
        */
        function swapRow(e) {
            var title = 'swapRow(::)';
            try {
                var rec = currentRecord.get();
                var tableID = jQuery(e.target).closest('table')[0].id;
                if (tableID == 'CSVtbl') {
                    var row = jQuery(e.target).closest('tr');
                    jQuery('#CSVmapTblBody').append(row);
                    serializeData();
                     var rowCount = jQuery('#CSVtblBody tr').length;
                     var remainingCsvFieldArray = [];
                     var obj;
                     if(rowCount > 0){
                         for(var x = 0; x < rowCount; x++){
                             obj = {};
                             obj.field = jQuery('#CSVtblBody').find('tr').find('td')[x].attributes[1].nodeValue;
                             remainingCsvFieldArray.push(obj);
                         }
                     }
                     if(remainingCsvFieldArray && remainingCsvFieldArray.length > 0){
                        rec.setValue({
                            fieldId: 'custpage_ab_csvremainingfields',
                            value: JSON.stringify(remainingCsvFieldArray)
                        });
                     }
                }
                if (tableID == 'CSVtblMap') {
                    var row = jQuery(e.target).closest('tr');
                    jQuery('#CSVtblBody').append(row);
                    commonLib.sortTable(jQuery('#CSVtbl'), 'asc');
                    //Update Code
                    serializeData();
                    var rowCount = jQuery('#CSVtblBody tr').length;
                    var remainingCsvFieldArray = [];
                    var obj;
                    if(rowCount > 0){
                        for(var x = 0; x < rowCount; x++){
                            obj = {};
                            obj.field = jQuery('#CSVtblBody').find('tr').find('td')[x].attributes[1].nodeValue;
                            remainingCsvFieldArray.push(obj);
                        }
                    }
                    if(remainingCsvFieldArray && remainingCsvFieldArray.length > 0){
                        rec.setValue({
                            fieldId: 'custpage_ab_csvremainingfields',
                            value:  JSON.stringify(remainingCsvFieldArray)
                        });
                     }
                }
                if (tableID == 'NetSuitetbl') {
                    var row = jQuery(e.target).closest('tr');
                    jQuery('#NetSuitemapTblBody').append(row);

                    serializeData();
                }
                if (tableID == 'NetSuitetblMap') {
                    var row = jQuery(e.target).closest('tr');
                    jQuery('#NetSuiteTblBody').append(row);
                    commonLib.sortTable(jQuery('#NetSuitetbl'), 'asc');
                    //Update Code
                    serializeData();
                }
                fieldChanged(rec);
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
         /** 
         * This function hides Item Level fields more better UI experience
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @param [event] e
         * @return null 
         * 
        */
        function hideLineItems(e) {
            var title = 'hideLineItems(::)';
            try {
                if (jQuery(e.target).closest("table").hasClass("my_table")) {
                    var $slideme = jQuery(e.target).closest("table").find(".slideme");
                    $slideme.slideToggle();
                    if ($slideme.css("display") === "none") {
                        jQuery($slideme.closest("td")).filter(".fields").css("border", "");
                    } else {
                        jQuery($slideme.closest("td")).filter(".fields").css("border", "0px");
                    }
                }
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        /** 
         * when swapRow(e) function is call through an event this functiona also call at the end of swapRow(e) function. 
         * This functon create an array of NetSuite Fields also CSV Fields, and this function call MiddleTableRows() function at the end
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @return null 
         * 
        */
        function serializeData() {
            var title = 'serializeData(::)';
            try {
                var NetSuiteMapArray = [];
                var itemLevelArray = [];
                var CsvMapArray = [];
                var obj;
                jQuery('#NetSuitetblMap .fields').each(function (index, td) {
                    var itemObj = jQuery(td).attr('name');
                    var lineIem = itemObj.substring(0, 4);
                    console.log('lineIem**()()', lineIem);
                    if (lineIem == 'Line') {
                        obj = {};
                        obj.csvField = jQuery(td).attr('linename');
                        obj.NSField = jQuery(td).attr('data-id');
                        itemLevelArray.push(obj);
                    }
                    NetSuiteMapArray.push(jQuery(td).attr('data-id'));
                });
                jQuery('#CSVmapTblBody .fields').each(function (index, td) {
                    CsvMapArray.push(jQuery(td).attr('data-id'));
                });
                localStorage.setItem('NetSiteMapRequireLengthData', NetSuiteMapArray);
                localStorage.setItem('CSVMapRequireLengthData', CsvMapArray);
                localStorage.setItem('itemLevelArray', JSON.stringify(itemLevelArray));
                MiddleTableRows();
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        /** 
         * This function call from serializeData() function.
         * This function create an object of bodyFields and LineFields and set to custom field for further use
         * also check either import record is add or update
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @return null 
         * 
        */
        function MiddleTableRows() {
            var title = 'MiddleTableRows(::)';
            try {
                var rec = currentRecord.get();
                var netsuitemaptableRows, netsuiteLines, csvmaptableRows, MapObjArray = [], obj,
                    NSbodyfield, NSRecordFieldMapObjJSON, internalIdObj;

                netsuitemaptableRows = localStorage.getItem('NetSiteMapRequireLengthData');
                var netsuitemaptableRowsArray = netsuitemaptableRows.split(",");

                netsuiteLines = JSON.parse(localStorage.getItem('itemLevelArray'));

                csvmaptableRows = localStorage.getItem('CSVMapRequireLengthData');
                var csvmaptableRowsArray = csvmaptableRows.split(",");

                if (netsuitemaptableRowsArray.length == csvmaptableRowsArray.length) {
                    for (var i = 0; i < netsuitemaptableRowsArray.length; i++) {
                        obj = {}
                        obj.csvField = csvmaptableRowsArray[i];//change here for header fields
                        obj.NSField = netsuitemaptableRowsArray[i];
                        MapObjArray.push(obj);
                    }
                    NSbodyfield = compareArraysExcludeDuplicates(MapObjArray, netsuiteLines, 'NSField');

                    var NSRecordFieldMapOBJ = {
                        'bodyFields': NSbodyfield,
                        'LineFields': netsuiteLines
                    };
                    console.log('NSRecordFieldMapOBJ ****#####', NSRecordFieldMapOBJ);
                    NSRecordFieldMapObjJSON = JSON.stringify(NSRecordFieldMapOBJ);
                    rec.setValue({
                        fieldId: 'custpage_ab_middletablerows',
                        value: NSRecordFieldMapObjJSON
                    });
                    //Check for update wheter internal Id is selected or not
                    internalIdObj = MapObjArray.filter(function (Obj) {
                        return Obj.NSField == 'id';
                    });
                    if (internalIdObj == '') {
                        rec.setValue({
                            fieldId: 'custpage_ab_internalidid',
                            value: '0'
                        });
                    } else {
                        rec.setValue({
                            fieldId: 'custpage_ab_internalidid',
                            value: '1'
                        });
                    }
                }
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        /** 
         * This function compare two array and exclude duplicates from an array.
         * This function call from MiddleTableRows() function
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @return null 
         * 
        */
        function compareArraysExcludeDuplicates(arr1, arr2, property) {
            var title = 'compareArraysExcludeDuplicates(::)';
            try {
                var set2 = new Set();
                for (var i = 0; i < arr2.length; i++) {
                    set2.add(arr2[i][property]);
                }

                var uniqueObjects = [];
                for (var j = 0; j < arr1.length; j++) {
                    if (!set2.has(arr1[j][property])) {
                        uniqueObjects.push(arr1[j]);
                    }
                }
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
            return uniqueObjects || [];
        }
        /** 
         * This function getDataFromURL() is used to getData from URL e.g saveMapping record ID & Type
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @return null 
         * 
        */
        function getDataFromURL(findString) {
            var title = 'getDataFromURL(::)';
            try {
                var docIdFromURLType = "";
                var srch = window.location.search.substring(1);
                var VariableArray = srch.split("&");
                for (var i = 0; i < VariableArray.length; i++) {
                    var KeyValuePair = VariableArray[i].split("=");
                    if (KeyValuePair[0] == findString) {
                        docIdFromURLType = KeyValuePair[1];
                        break; // Once we find the "recid" parameter, no need to continue the loop
                    }
                }
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
            return docIdFromURLType || '';
        }
        /** 
         * This function useSaveMappingFun() calls from UE script (AB_UE_savedMappingBTN.js) to call a save maping suitelet
         * 
         * @author marslan@AlphaBOLDconsultants.com 
         * @return null 
         * 
        */
        function useSaveMappingFun(recid, recType) {
            var title = 'useSaveMappingFun(::)';
            try {
                var scriptURL = nsUrl.resolveScript({
                    scriptId: 'customscript_ab_sl_use_save_map_csv',
                    deploymentId: 'customdeploy_ab_sl_use_save_map_csv',
                    params: {
                        recid: recid,
                        recType: recType
                    },
                    returnExternalUrl: false
                });
                newWindow = window.open(scriptURL);
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        return {
            pageInit: pageInit,
            fieldChanged: fieldChanged,
            selectRecTypeToImportCvs: selectRecTypeToImportCvs,
            useSaveMappingFun: useSaveMappingFun
        }
    });

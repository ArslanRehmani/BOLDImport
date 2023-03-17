/**
 *@NApiVersion 2.0
*@NScriptType ClientScript
*/
define(['N/record', 'N/search', 'N/currentRecord', '../class/ab_CLS_boldImportRecords.js', '../common/ab_lib_convertCSVToJson.js', '../common/ab_lib_common.js', '../common/ab_lib_cs_fun.js'], function (record, search, currentRecord, importRecordCLS, convertCSVLIB, commonLib, csFunLib) {

    function pageInit(context) {
        try {
            selectRecTypeToImportCvs(context);
            window.swapRow = swapRow;
            window.hideLineItems = hideLineItems;
            var headerFields;
            var record = currentRecord.get();
            var NetSuiteArray = [];

            // var recordField = 'customrecord_ab_payroll_mapping';
            var recordField = localStorage.getItem('recscan');;
            //set value in second step so that we can create record with repective record type
            record.setValue({
                fieldId: 'custpage_ab_rectypelocalstorage',
                value: recordField
            });
            var csvdata = localStorage.getItem('csvData');
            console.log('csvdata()**()', csvdata);
            if (csvdata) {
                var csv_json = JSON.parse(csvdata);
                record.setValue({
                    fieldId: 'custpage_ab_csvdata',
                    value: csvdata
                });
                if (csv_json.length) {
                    headerFields = Object.keys(csv_json[0]);
                }
            }
            if (recordField) {
                var recordFields = csFunLib.getRecordFields(recordField);
                if (recordFields.bodyfields.length) {
                    console.log('if stat ----->', recordFields.bodyfields.length);
                    var recordFieldVal = window.nlapiGetFieldValue('custpage_hidden_data_field')
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
                            for (var i = 0; i <= recordFields.sublistFields.item.length - 1; i++) {
                                var datarec = recordFields.sublistFields.item[i];
                                var mandatoryData = datarec.isMandator;
                                var staric = '*(required)';
                                if (mandatoryData == true) {
                                    if(recordField =="workorder"){
                                        continue;
                                    }
                                    html += '<tr class="hideTr">\
                                            <td class = "fields padding-0 border-none" data-id = "'+ datarec.id + '" name = "mapFields">\
                                                <div class="slideme padding-75" style="display: none; padding-left:40px;">\
                                                    <a onclick="swapRow(event)" title="'+datarec.name+'" class="a-display font-italic">\
                                                        <div class="contect-height position-relative">\
                                                            <span class="padding-right left-icon icon"><i class="fa fa-arrow-left"></i></span>\
                                                            ' + "<span> <strong>lineItem : </strong> </span>" + datarec.name + '<span style="color: red;">' + staric + '</span>\
                                                            <span class="padding-right right-icon icon"><i class="fa fa-times"></i></span>\
                                                        </div>\
                                                    </a>\
                                                </div>\
                                            </td>\
                                            </tr>'
                                    NetSuiteArray.push(datarec.id);
                                } else {
                                    html += '<tr class="hideTr">\
                                                <td class = "fields padding-0 border-none" data-id = "'+ datarec.id + '" name = "mapFields">\
                                                <div class="slideme padding-75" style="display: none; padding-left:40px;">\
                                                    <a onclick="swapRow(event)" title="'+datarec.name+'" class="a-display font-italic">\
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
                    }

                    for (var i = 0; i <= recordFields.bodyfields.length - 1; i++) {
                        var datarec = recordFields.bodyfields[i];
                        var mandatoryData = datarec.isMandator;
                        var staric = '*(required)';
                        if (mandatoryData == true) {
                            html += '<tr>\
                                        <td class = "fields" data-id = "'+ datarec.id + '" name = "mapFields"><a onclick="swapRow(event)" title="'+datarec.name+'" class="a-display"><div class="contect-height position-relative"><span class="padding-right left-icon icon"><i class="fa fa-arrow-left"></i></span>' + datarec.name + '<span style="color: red;">' + staric + '</span><span class="padding-right right-icon icon"><i class="fa fa-times"></i></span></div></a></td>\
                                        </tr>'
                            NetSuiteArray.push(datarec.id);
                        } else {
                            html += '<tr>\
                                        <td class = "fields" data-id = "'+ datarec.id + '" name = "mapFields"><a onclick="swapRow(event)" title="'+datarec.name+'" class="a-display"><div class="contect-height position-relative"><span class="padding-right left-icon icon"><i class="fa fa-arrow-left"></i></span>' + datarec.name + '<span class="padding-right right-icon icon"><i class="fa fa-times"></i></span></div></a></td>\
                                        </tr>'
                        }
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
                                    <tbody id= "NetSuitemapTblBody">\
                                    </tbody>\
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
                    for (var i = 0; i <= headerFields.length - 1; i++) {
                        var headerField = headerFields[i];
                        html += '<tr>\
                                    <td class = "fields" data-id = "'+ headerField + '" name = "CSVFields">\
                                        <a onclick="swapRow(event)" title="'+headerField+'" class="a-display">\
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
                                    <tbody id= "CSVmapTblBody">\
                                    </tbody>\
                                </table>\
                            </div>\
                        </div>\
                    </div>\
                    </form>\
                    </body>\
                    </html>';

                    window.nlapiSetFieldValue('custpage_hidden_data_field', html);
                    commonLib.sortTable(jQuery('#NetSuitetbl'), 'asc');
                    commonLib.sortTable(jQuery('#CSVtbl'), 'asc');
                }
            }

            localStorage.setItem('NetSuiteRequireDataLength', NetSuiteArray);
            window.getJsonCSV = convertCSVLIB.getJsonCSV;
            window.csvJSON = convertCSVLIB.csvJSON;
        } catch (e) {
            alert("ERROR" + e.message)
        }
    }

    function selectRecTypeToImportCvs(context) {
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
            log.debug(e.message);
        }
    }

    function fieldChanged(context) {
        try {
            var rec = currentRecord.get();
            var netsuitedata = jQuery('#NetSuitetblMap .fields').length;
            var csvmapdata = jQuery('#CSVtblMap .fields').length;
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

            var NetSuiteReuireLength = localStorage.getItem('NetSuiteRequireDataLength');
            var NetSuiteRequireArray = NetSuiteReuireLength.split(",");
            var CsvReuireLength = localStorage.getItem('NetSiteMapRequireLengthData');
            var csvRequirarray = CsvReuireLength ? CsvReuireLength.split(",") : [];
            var mapedarray = NetSuiteRequireArray.filter(function (element) {
                return csvRequirarray.includes(element);
            });
            console.log('mapedarray', mapedarray);
            var mapedarraysort = mapedarray.sort();
            var netsuitearraysort = NetSuiteRequireArray.sort();
            var issamearrays = (mapedarraysort.length == netsuitearraysort.length) && mapedarraysort.every(function (element, index) {
                return element === netsuitearraysort[index];
            });
            console.log('issamearrays', issamearrays);
            if (NetSuiteRequireArray != '') {
                if (issamearrays == 'true' || issamearrays == true) {
                    rec.setValue({
                        fieldId: 'custpage_ab_reuiremapdatalength',
                        value: true,
                        ignoreFieldChange: true
                    });
                } else {
                    rec.setValue({
                        fieldId: 'custpage_ab_reuiremapdatalength',
                        value: false,
                        ignoreFieldChange: true
                    });
                }
            } else {
                rec.setValue({
                    fieldId: 'custpage_ab_reuiremapdatalength',
                    value: true,
                    ignoreFieldChange: true
                });
            }
            var currentRec = context.currentRecord;
            var fieldId = context.fieldId;
            var selectedRecordForImport = currentRec.getValue({
                fieldId: 'custpage_ab_record_type'
            });
            if (fieldId == 'custpage_ab_record_type') {
                console.log('Valuessss', selectedRecordForImport);
                rec.getValue({
                    fieldId: 'custpage_ab_record_type'
                });
                if (selectedRecordForImport != null) {
                    localStorage.setItem('recscan', selectedRecordForImport);
                }
            }
            var selectAddUpdate = jQuery('input[name="custpage_ab_add"]:checked').val();
            localStorage.setItem('selectoption', selectAddUpdate);
            console.log('select option', selectAddUpdate);
            var selectOption = localStorage.getItem('selectoption');
            if (fieldId == 'custpage_ab_add') {
                rec.setValue({
                    fieldId: 'custpage_ab_selectoption',
                    value: selectOption
                });
            }

        } catch (e) {
            log.debug(e.message);
        }
    }
    //Function for tables row that move (swap) from one table to another
    function swapRow(e) {

        var rec = currentRecord.get();
        var tableID = jQuery(e.target).closest('table')[0].id;
        if (tableID == 'CSVtbl') {
            var row = jQuery(e.target).closest('tr');
            jQuery('#CSVmapTblBody').append(row);
            serializeData();
        }
        if (tableID == 'CSVtblMap') {
            var row = jQuery(e.target).closest('tr');
            jQuery('#CSVtblBody').append(row);
            commonLib.sortTable(jQuery('#CSVtbl'), 'asc');
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
        }
        fieldChanged(rec);
    }
    function hideLineItems(e) {
        // jQuery('#hideRow').click(function () {
        //     jQuery('.hideTr').toggle();//this one is working with double click
        // });
        console.log("TEST");
        // jQuery('.accordian-body').on('show.bs.collapse', function () {
        //     console.log("TEST2");
        //     console.log("TEST2");
        //     jQuery(this).closest("table")
        //         .find(".collapse.in")
        //         .not(this)
        //         //.collapse('toggle')
        // })
        if (jQuery(e.target).closest("table").hasClass("my_table")) {
            var $slideme = jQuery(e.target).closest("table").find(".slideme");
            $slideme.slideToggle();
            console.log("TEST1");
            if ($slideme.css("display") === "none") {
                console.log("TEST if");
                jQuery($slideme.closest("td")).filter(".fields").css("border", "");
            } else {
                console.log("TEST else");
                jQuery($slideme.closest("td")).filter(".fields").css("border", "0px");
            }
        }
        //     // if ($('.slideme').is(':hidden') && $('.slideme').closest('table').hasClass('my_table')) {
        //     //     $('.slideme').closest('tr').css('border', 'none');
        //     //   }
        //     if (jQuery(".slideme").css("display") === "none") {
        //         console.log("Test Pasa")
        //         jQuery('.slideme').closest('tr').css('border', 'none');
        //       }
              
        // }
        // if (jQuery(e.target).closest("table").hasClass("my_table")) {
        //     var $slideme = jQuery(e.target).closest("table").find(".slideme");
        //     if ($slideme.css('display') === 'none') {
        //       $slideme.closest("tr").removeClass("remove-border");
        //     }
        //     $slideme.slideToggle();
        //   }
          
    }
    function serializeData() {
        var nsData = [];
        var NetSuiteMapArray = [];
        var CsvMapArray = [];
        jQuery('#NetSuitetblMap .fields').each(function (index, td) {
            nsData.push(jQuery(td).attr('data-id'))
            console.log("td ->", jQuery(td).attr('data-id'))
            NetSuiteMapArray.push(jQuery(td).attr('data-id'));
        })
        var nsMapLength = nsData.length;
        console.log("netsuite Map length", nsMapLength);
        var csvData = [];
        jQuery('#CSVmapTblBody .fields').each(function (index, td) {
            csvData.push(jQuery(td).attr('data-id'));
            CsvMapArray.push(jQuery(td).attr('data-id'));
            console.log("tdCSV ->", jQuery(td).attr('data-id'))
        })
        var csvMapLength = csvData.length;
        console.log("CSV Map length", csvMapLength);
        localStorage.setItem('NetSiteMapRequireLengthData', NetSuiteMapArray);
        localStorage.setItem('CSVMapRequireLengthData', CsvMapArray);
        MiddleTableRows();
    }
    function MiddleTableRows() {
        console.log("middletable row is calling---------------------------------------------------")
        var rec = currentRecord.get();
        var netsuitemaptableRows = localStorage.getItem('NetSiteMapRequireLengthData');
        var netsuitemaptableRowsArray = netsuitemaptableRows.split(",");
        console.log('netsuitemaptableRowsArray.length', netsuitemaptableRowsArray.length);

        var csvmaptableRows = localStorage.getItem('CSVMapRequireLengthData');
        var csvmaptableRowsArray = csvmaptableRows.split(",");

        var MapObjArray = [];
        var csvheaderArray = [];
        var obj = {};
        var LineObj = {};
        var LineLevelArray = [];
        var csvHeaderObj = {};
        if (netsuitemaptableRowsArray.length == csvmaptableRowsArray.length) {
            for (var i = 0; i < netsuitemaptableRowsArray.length; i++) {
                obj = {}
                csvHeaderObj = {}
                // csvHeaderObj use for csv header key 
                csvHeaderObj[netsuitemaptableRowsArray[i]] = csvmaptableRowsArray[i];
                csvheaderArray.push(csvHeaderObj);
                var csvHeader = csvmaptableRowsArray[i];
                var lineIem = csvHeader.substring(0, 4);
                console.log('lineIem**()()', lineIem);
                if (lineIem == 'Line') {
                    LineObj = {}
                    LineObj.csvField = csvmaptableRowsArray[i];
                    LineObj.NSField = netsuitemaptableRowsArray[i];
                    LineLevelArray.push(LineObj);

                } else {
                    obj.csvField = csvmaptableRowsArray[i];//change here for header fields
                    obj.NSField = netsuitemaptableRowsArray[i];
                    MapObjArray.push(obj);
                }
            }
            console.log('MapObjArray in mid Table', MapObjArray);
            console.log('LineLevelArray in mid Table***()()', LineLevelArray);
            var mapobjarrayjson = JSON.stringify(MapObjArray)
            var linelevelarrayjson = JSON.stringify(LineLevelArray)
            rec.setValue({
                fieldId: 'custpage_ab_middletablerows',
                value: mapobjarrayjson
            });
            rec.setValue({
                fieldId: 'custpage_ab_line_level_data',
                value: linelevelarrayjson
            });
            //Check for update wheter internal Id is selected or not
            var internalIdObj = MapObjArray.filter(function (obj) {
                return obj.NSField == 'id';
            });
            console.log('internalIdObj', internalIdObj);
            //value = 0 if no internal id is found
            // value = 1 if thier is internal id is selected in mapping
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

            console.log('csvheaderArray', csvheaderArray);
            var csvheaderArrayjson = JSON.stringify(csvheaderArray);
            rec.setValue({
                fieldId: 'custpage_ab_middletablerows_csv_header',
                value: csvheaderArrayjson
            });
        }
    }
    function ViewError(e){
        var title = 'viewError(::)';
        try{
            alert('Errrrr0rr');
        } catch(e) {
            log.debug('Exception ' +title, e.message);
        }  
    }
    return {
        pageInit: pageInit,
        fieldChanged: fieldChanged,
        ViewError: ViewError,
        selectRecTypeToImportCvs: selectRecTypeToImportCvs
    }
});
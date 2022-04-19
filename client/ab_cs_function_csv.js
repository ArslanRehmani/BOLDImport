        /**
         *@NApiVersion 2.0
        *@NScriptType ClientScript
        */
        define(['N/record', 'N/search', 'N/currentRecord', '../class/ab_CLS_boldImportRecords.js', '../common/ab_lib_convertCSVToJson.js'], function (record, search, currentRecord, importRecordCLS, convertCSVLIB) {

            function pageInit(context) {
                try {
                    recType(context);
                    window.swapRow = swapRow;
                    var headerFields;
                    

                    var record = currentRecord.get();
                    var currentRec =  context.currentRecord;
                    var NetSuiteArray = [];
                    var NetsuiteMaparray = [];

                    
                    

                    // var recordField = 'customrecord_ab_payroll_mapping';
                    var recordField = localStorage.getItem('recscan');
                    console.log('recTypeFirstStep local data', recordField);
                    //set value in second step so that we can create record with repective record type
                    record.setValue({
                        fieldId: 'custpage_ab_rectypelocalstorage',
                        value: recordField
                    });


                    var csvdata = localStorage.getItem('csvData')
                    if(csvdata){
                    var csv_json =  JSON.parse(csvdata);
                    record.setValue({
                        fieldId: 'custpage_ab_csvdata', 
                        value: csvdata
                    });
                    // console.log('csvdata<<<<==>>>',csvdata);
                    // var internalIDValue = csv_json[InternalId];
                    // console.log('internalIDValue<<<<==>>>',internalIDValue);
                    if(csv_json.length){
                        headerFields = Object.keys(csv_json[0]);
                        // headerFieldsVal = Object.values(csv_json[0]);
                        // var internalIDVal = headerFieldsVal[0];
                        // console.log('internalIDVal<<<<==>>>',internalIDVal);
                        // record.setValue({
                        //     fieldId: 'custpage_ab_internalidid',
                        //     value: internalIDVal
                        // });
                    }
                    }
                    // var internalIDVal = new Array("InternalId");
                    // if( jQuery.inArray("InternalId", internalIDVal) !== -1 ) {
                    //     var val = headerFields[0];
                    //     console.log('InternalId Val ===<<<',val);
                    // }
                    // var html = '<h1>Fields are loaded</h1>';
                    // window.nlapiSetFieldValue('custpage_hidden_data_field', html);

            if (recordField) {
                console.log('recordField is issue here',recordField);
                var recordFields = getRecordFields(recordField)
                console.log('Fileds -> is issue here', recordFields);
                if (recordFields.bodyfields.length) {
                    console.log('if stat ----->',recordFields.bodyfields.length);
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
                    <style>\
                    body {\
                        color: #404E67;\
                        background: #F5F7FA;\
                        font-family: "Open Sans", sans-serif;\
                    }\
                    .table-wrapper {\
                        width: 700px;\
                        margin: 30px auto;\
                        background: #fff;\
                        padding: 20px;box-shadow: 0 1px 1px rgba(0,0,0,.05);\
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
                    </style>\
                    </head>\
                    <body>\
                    <form>\
                    <div class="container-lg">\
                        <div id="right-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 80%;">\
                                <div class="table-title">\
                                    <div class="row">\
                                        <div class="col-sm-4"><h2>NetSuite Record</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered " id= "NetSuitetbl" >\
                                    <thead>\
                                        <tr>\
                                            <th>NetSuite Field Name</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "NetSuiteTblBody">';
                                    for (var i = 0; i <= recordFields.sublistFields.item.length - 1; i++) {
                                        var datarec = recordFields.sublistFields.item[i];
                                        var mandatoryData = datarec.isMandator;
                                        var staric = '*(required)';
                                        if(mandatoryData == true){
                                            html += '<tr>\
                                        <td class = "fields" data-id = "'+datarec.id+'" name = "mapFields"><a onclick="swapRow(event)" title="Delete"><i class="fa fa-arrows-h"></i></a>'+"<span> <strong> lineItem : </strong> </span>"+ datarec.name +''+staric+'</td>\
                                        </tr>'
                                        NetSuiteArray.push(datarec.id);
                                        }else{
                                            html += '<tr>\
                                        <td class = "fields" data-id = "'+datarec.id+'" name = "mapFields"><a onclick="swapRow(event)" title="Delete"><i class="fa fa-arrows-h"></i></a>'+ " <span> <strong> lineItem : </strong> </span>"+datarec.name +'</td>\
                                        </tr>'
                                        // NetsuiteMaparray.push()
                                        }   
                                    }
                                    for (var i = 0; i <= recordFields.bodyfields.length - 1; i++) {
                                        var datarec = recordFields.bodyfields[i];
                                        var mandatoryData = datarec.isMandator;
                                        var staric = '*(required)';
                                        if(mandatoryData == true){
                                            html += '<tr>\
                                        <td class = "fields" data-id = "'+datarec.id+'" name = "mapFields"><a onclick="swapRow(event)" title="Delete"><i class="fa fa-arrows-h"></i></a>'+ datarec.name +''+staric+'</td>\
                                        </tr>'
                                        NetSuiteArray.push(datarec.id);
                                        }else{
                                            html += '<tr>\
                                        <td class = "fields" data-id = "'+datarec.id+'" name = "mapFields"><a onclick="swapRow(event)" title="Delete"><i class="fa fa-arrows-h"></i></a>'+ datarec.name +'</td>\
                                        </tr>'
                                        // NetsuiteMaparray.push()
                                        }   
                                    }          
          
                        html += '</tbody>\
                                </table>\
                            </div>\
                        </div>\
                        <div id="right-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 80%;">\
                                <div class="table-title">\
                                    <div class="row">\
                                        <div class="col-sm-4"><h2>NetSuite Record Mapping</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered" id= "NetSuitetblMap" >\
                                    <thead>\
                                        <tr>\
                                            <th>NetSuite Field Map</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "NetSuitemapTblBody">\
                                    </tbody>\
                                </table>\
                            </div>\
                        </div>\
                        <div id="left-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 80%;">\
                                <div class="table-title">\
                                    <div class="row">\
                                        <div class="col-sm-4"><h2>CSV Record</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered" id= "CSVtbl" >\
                                    <thead>\
                                        <tr>\
                                            <th>CSV Field Name</th>\
                                        </tr>\
                                    </thead>\
                                    <tbody id= "CSVtblBody">';
                                    for (var i = 0; i <= headerFields.length - 1; i++) {
                                        var headerField = headerFields[i];
                                        html += '<tr>\
                                        <td class = "fields" data-id = "'+headerField+'" name = "CSVFields"><a onclick="swapRow(event)" title="Delete"><i class="fa fa-arrows-h"></i></a>'+ headerField+'</td>\
                                        </tr>'
                                    }

                                    html +=   '</tbody>\
                                </table>\
                            </div>\
                        </div>\
                        <div id="left-Float" style="width: 25%;">\
                            <div class="table-wrapper" style="width: 80%;">\
                                <div class="table-title">\
                                    <div class="row">\
                                        <div class="col-sm-4"><h2>CSV Record Mapping</h2></div>\
                                    </div>\
                                </div>\
                                <table class="table table-bordered" id= "CSVtblMap" >\
                                    <thead>\
                                        <tr>\
                                            <th>CSV Field Map</th>\
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
                            sortTable(jQuery('#NetSuitetbl'),'asc');
                            sortTable(jQuery('#CSVtbl'),'asc');
                }
            }
            
            //console.log('NetSuite Require Fields Data', NetSuiteArray);
            localStorage.setItem('NetSuiteRequireDataLength',NetSuiteArray);
                    //console.log('recordField1', recordField);

                    window.getJsonCSV = convertCSVLIB.getJsonCSV;
                    window.csvJSON = convertCSVLIB.csvJSON;
                } catch (e) {
                    alert("ERROR" + e.message)
                }
            }

            function recType(context) {
                try {
                    var record = currentRecord.get();
                    var importRecords = importRecordCLS.getList();
                    //console.log('options->', importRecords);
                    var importRec = record.getField('custpage_ab_record_type');
                    if (!!importRec) {
                        importRec.removeSelectOption({
                            value: null
                        });
                        importRec.insertSelectOption({
                            value: '',
                            text: 'please select record type',
                            isSelected :true
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
            //funtion call from suitelet
            function getRecordFields(recID) {
                var title = 'getRecordFields()::';
                var fields, rec, rank;
                try {
                    rec = record.create({
                        type: recID,
                        isDynamic: true,
                    });
                    console.log('recID',recID);
                    console.log('rec',rec);
                
                    if (rec) {
                        console.log('fields before',fields);
                        // console.log('convertCSVLIB',convertCSVLIB.getRecFields(rec));
                        fields = convertCSVLIB.getRecFields(rec);
                        console.log('fields after',fields);
                        
                        if (fields.bodyfields.length) {
                            return fields;
                        } else {
                            throw new Error('Fields not found please check record id on import custom records');
                        }
                    } else {
                        throw new Error('Record Not defined please check record id on import custom records');
                    }
                } catch (error) {
                    log.error(title + error.name, error.message)
                }
            }

            function fieldChanged(context) {
                try {
                        var rec =  currentRecord.get();
                        // console.log("field is chaging values ------------------------------------")
                        
                    var  netsuitedata = jQuery('#NetSuitetblMap .fields').length;
                    console.log('netsuitedatalenght1 --->', netsuitedata);
                        var csvmapdata = jQuery('#CSVtblMap .fields').length;
                        console.log('csvmapdatalength1  --->', csvmapdata);

                        if(netsuitedata == csvmapdata){
                        // console.log('testin for true condition-------->', netsuitedata == csvmapdata)
                            rec.setValue({
                                fieldId: 'custpage_ab_truedata',
                                value: true,
                                ignoreFieldChange: true
                            });
                        }else{
                        // console.log('testin for false condition-------->', netsuitedata == csvmapdata)
                            rec.setValue({
                                fieldId: 'custpage_ab_truedata',
                                value: false,
                                ignoreFieldChange: true
                            });
                        }

                        var NetSuiteReuireLength = localStorage.getItem('NetSuiteRequireDataLength');
                   console.log('NetSuiteReuireLength------+++++>>>>>',NetSuiteReuireLength);
                    var NetSuiteRequireArray = NetSuiteReuireLength.split(",");

                    console.log('NetSuiteRequireArray------+++++>>>>>',NetSuiteRequireArray);
                    var NetSuiteReuireLengthSplit = NetSuiteReuireLength.split(",").length;
                   console.log('NetSuiteReuireLengthSplit------+++++>>>>>',NetSuiteReuireLengthSplit);
                var CsvReuireLength = localStorage.getItem('NetSiteMapRequireLengthData');
                    console.log('CsvReuireLength------+++++>>>>>',CsvReuireLength);
                    var csvRequirarray = CsvReuireLength ? CsvReuireLength.split(",") : [];

                    console.log('csvRequirarray------+++++>>>>>',csvRequirarray);
                    var CsvReuireLengthSplit = CsvReuireLength ? CsvReuireLength.split(",").length : 0;
                   console.log('CsvReuireLengthSplit------+++++>>>>>',CsvReuireLengthSplit);
                    // if(CsvReuireLengthSplit >= NetSuiteReuireLengthSplit)  {

                        // var mapedarray = NetSuiteRequireArray.filter(element => csvRequirarray.includes(element));
                        var mapedarray = NetSuiteRequireArray.filter(function(element){
                            return csvRequirarray.includes(element); 
                            });
                            console.log('mapedarray',mapedarray);
                                var mapedarraysort = mapedarray.sort();
                                var netsuitearraysort = NetSuiteRequireArray.sort();
                                var issamearrays = (mapedarraysort.length == netsuitearraysort.length) && mapedarraysort.every(function(element, index) {
                                    return element === netsuitearraysort[index]; 
                                });
                                console.log('issamearrays',issamearrays);
                                if(NetSuiteRequireArray != ''){
                                    if(issamearrays == 'true' || issamearrays == true){
                                        rec.setValue({
                                            fieldId: 'custpage_ab_reuiremapdatalength',
                                            value: true,
                                            ignoreFieldChange: true
                                        });
                                        console.log('*require is true', 'true');
                                    }else{
                                        rec.setValue({
                                            fieldId: 'custpage_ab_reuiremapdatalength',
                                            value: false,
                                            ignoreFieldChange: true
                                        });
                                        console.log('*require is false', 'false');
                                    } 
                                }else{
                                    rec.setValue({
                                        fieldId: 'custpage_ab_reuiremapdatalength',
                                        value: true,
                                        ignoreFieldChange: true
                                    });
                                    console.log('*require is false', 'false');
                                }
                                   
                        
                    // }
                    console.log("filed change working?")
                        var currentRec =  context.currentRecord;
                        var fieldId = context.fieldId;
                        var val = currentRec.getValue({
                            fieldId: 'custpage_ab_record_type'
                        });
                        var recordFields = getRecordFields(recordField);
                        console.log("fieldId" , fieldId)
                        if (fieldId == 'custpage_ab_record_type') {
                            console.log('Valuessss', val);
                            var recordField = rec.getValue({
                                fieldId: 'custpage_ab_record_type'
                            });
                            if(val != null){
                                localStorage.setItem('recscan', val);
                            }
                             
                        }
                        console.log('context1', context);
                        var select = jQuery('input[name="custpage_ab_add"]:checked').val();
                        localStorage.setItem('selectoption',select);
                        console.log('select option', select);
                        var selectOption  = localStorage.getItem('selectoption');
                        if(fieldId == 'custpage_ab_add'){
                            rec.setValue({
                                fieldId: 'custpage_ab_selectoption',
                                value: selectOption
                            });
                        }
                        
                        // if(selectOption == 'Update'){

                        // }
                        
                        

                } catch (e) {
                    log.debug(e.message);
                }
            }

            //Function for tables row that move (swap) from one table to another
            function swapRow(e){ 
                    //console.log("event",e)
                    var rec = currentRecord.get();
                    //console.log("jQuery(e.target).closest('table')",jQuery(e.target).closest('table')[0].id);
                    var tableID = jQuery(e.target).closest('table')[0].id;
                    //console.log("tableID",tableID)
                    if(tableID == 'CSVtbl'){
                        var row =  jQuery(e.target).closest('tr');
                        jQuery('#CSVmapTblBody').append(row);
                        serializeData();
                    }
                    if(tableID == 'CSVtblMap'){
                        var row =  jQuery(e.target).closest('tr');
                        jQuery('#CSVtblBody').append(row);
                        sortTable(jQuery('#CSVtbl'),'asc');
                    }
                    if(tableID == 'NetSuitetbl'){
                        var row =  jQuery(e.target).closest('tr');
                        jQuery('#NetSuitemapTblBody').append(row);
                     
                        serializeData();
                    }
                    if(tableID == 'NetSuitetblMap'){
                        var row =  jQuery(e.target).closest('tr');
                        jQuery('#NetSuiteTblBody').append(row);
                        sortTable(jQuery('#NetSuitetbl'),'asc');
                    }
                    fieldChanged(rec);
                        
            }
            
            function serializeData(){
                var nsData = [];
                var NetSuiteMapArray = [];
                var CsvMapArray = [];
                jQuery('#NetSuitetblMap .fields').each(function(index,td){
                    nsData.push(jQuery(td).attr('data-id'))
                    console.log("td ->",jQuery(td).attr('data-id'))
                    NetSuiteMapArray.push(jQuery(td).attr('data-id'));
                })
                var nsMapLength = nsData.length;
                    console.log("netsuite Map length",nsMapLength);
                var csvData = [];
                jQuery('#CSVmapTblBody .fields').each(function(index,td){
                    csvData.push(jQuery(td).attr('data-id'));
                    CsvMapArray.push(jQuery(td).attr('data-id'));
                   console.log("tdCSV ->",jQuery(td).attr('data-id'))
                })
                var csvMapLength = csvData.length;
                    console.log("CSV Map length",csvMapLength);
               //console.log('NetSuiteMapArray --==>',NetSuiteMapArray);
                localStorage.setItem('NetSiteMapRequireLengthData',NetSuiteMapArray);
                localStorage.setItem('CSVMapRequireLengthData',CsvMapArray);
                MiddleTableRows();
            }
            function MiddleTableRows(){
                console.log("middletable row is calling---------------------------------------------------")
                var rec = currentRecord.get();
                var netsuitemaptableRows = localStorage.getItem('NetSiteMapRequireLengthData');
                   var netsuitemaptableRowsArray = netsuitemaptableRows.split(",");
                   console.log('netsuitemaptableRowsArray.length',netsuitemaptableRowsArray.length);

                   var csvmaptableRows = localStorage.getItem('CSVMapRequireLengthData');
                   var csvmaptableRowsArray = csvmaptableRows.split(",");

                   var MapObjArray = [];
                   var csvheaderArray = [];
                   var obj ={};
                   var csvHeaderObj = {};
                   if (netsuitemaptableRowsArray.length == csvmaptableRowsArray.length){
                    for (var i=0; i<netsuitemaptableRowsArray.length; i++){
                        obj = {}
                        csvHeaderObj = {}
                        // csvHeaderObj use for csv header key 
                        csvHeaderObj[netsuitemaptableRowsArray[i]] = csvmaptableRowsArray[i];
                        csvheaderArray.push(csvHeaderObj);
                        obj.csvField = csvmaptableRowsArray[i];
                        obj.NSField = netsuitemaptableRowsArray[i];
                        MapObjArray.push(obj);
                    }
                    console.log('MapObjArray in mid Table',MapObjArray);
                    var mapobjarrayjson = JSON.stringify(MapObjArray)
                    rec.setValue({
                        fieldId: 'custpage_ab_middletablerows',
                        value: mapobjarrayjson
                    });
                    //Check for update wheter internal Id is selected or not
                    var internalIdObj = MapObjArray.filter(function (obj){
                        return obj.NSField == 'id';
                    });
                    console.log('internalIdObj',internalIdObj);
                    //value = 0 if no internal id is found
                    // value = 1 if thier is internal id is selected in mapping
                    if(internalIdObj== ''){
                        rec.setValue({
                            fieldId: 'custpage_ab_internalidid',
                            value: '0'
                        });
                    }else{
                        rec.setValue({
                            fieldId: 'custpage_ab_internalidid',
                            value: '1'
                        });
                    }
                   
                    console.log('csvheaderArray',csvheaderArray);
                    var csvheaderArrayjson = JSON.stringify(csvheaderArray);
                    rec.setValue({
                        fieldId: 'custpage_ab_middletablerows_csv_header',
                        value: csvheaderArrayjson
                    });
                   }        
            }
            function sortTable(table, order) {
                var asc   = order === 'asc',
                    tbody = table.find('tbody');
            
                tbody.find('tr').sort(function(a, b) {
                    if (asc) {
                        return jQuery('td:first', a).text().localeCompare(jQuery('td:first', b).text());
                    } else {
                        return jQuery('td:first', b).text().localeCompare(jQuery('td:first', a).text());
                    }
                }).appendTo(tbody);
            }

            return {
                pageInit: pageInit,
                fieldChanged: fieldChanged,
                recType: recType
            }
        });
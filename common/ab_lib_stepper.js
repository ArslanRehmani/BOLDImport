
define(['N/log','N/ui/serverWidget','N/url'], function (log,serverWidget,url) {
    return {
        fields:{
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
        buildSecondStep: function(assistance) {
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
        buildThirdStep: function(assistance) {
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
        buildFourthStep: function(assistance) {
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
                filedsFld.defaultValue = '<h1 style="color: green;">CSV Import Process Completed</h1>';
                var btn = assistance.addField({
                    id: 'custpage_ab_btn',
                    type: serverWidget.FieldType.INLINEHTML,
                    label: 'Records btn'
                });
                btn.updateDisplayType({
                    displayType: serverWidget.FieldDisplayType.NORMAL
                });
                btn.defaultValue = '<button> <a onclick="ViewError(event)" title="View Errors"></a>View Errors</button>';
            } catch (error) {
                log.error(title + error.name, error.message)
            }
        }
    }
});
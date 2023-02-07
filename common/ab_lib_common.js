
define(['N/log'], function (log) {
    return {
        fields:{
            stepId: 'custpage_ab_filemap'
        },
        getThirdStepFieldMapLengthRequire: function (assistance) {
            var title = 'GetThirdStepFieldMapLengthRequire()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var require = recStep3.getValue({
                    id: 'custpage_ab_reuiremapdatalength'
                });
                return require
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        getThirdStepFieldMapLength: function (assistance) {
            var title = 'GetThirdStepFieldMapLength()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var MapLength = recStep3.getValue({
                    id: 'custpage_ab_truedata'
                });
                return MapLength
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        createRecordInnetsuite: function(assistance) {
            var title = 'createRecordInnetsuite()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var middletablerow = recStep3.getValue({
                    id: 'custpage_ab_middletablerows'
                });
                return middletablerow
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        createRecordLineLevelData: function(assistance) {
            var title = 'createRecordLineLevelData()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var lineLevelData = recStep3.getValue({
                    id: 'custpage_ab_line_level_data'
                });
                return lineLevelData
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        mapedFieldArrayfunction: function(assistance) {
            var title = 'mapedFieldArrayfunction()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var middletablerowcsvHeader = recStep3.getValue({
                    id: 'custpage_ab_middletablerows_csv_header'
                });
                return middletablerowcsvHeader
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        recordType: function(assistance) {
            var title = 'RecordType()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var recTypelocal = recStep3.getValue({
                    id: 'custpage_ab_rectypelocalstorage'
                });
                return recTypelocal
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        csvDatafromSecondStep: function(assistance) {
            var recStep123 = assistance.getStep({
                id: 'custpage_ab_importopt'
            });
            var csvData = recStep123.getValue({
                id: 'custpage_ab_csvdata'
            });
            return csvData
        },
        getSelectOption: function(assistance) {
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
        },
        internalidOBJ: function(assistance) {
            var title = 'internalidOBJ()::';
            try {
                var recStep3 = assistance.getStep({
                    id: this.fields.stepId
                });
                var internalid1or0 = recStep3.getValue({
                    id: 'custpage_ab_internalidid'
                });
                return internalid1or0
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        sortTable: function(table, order) {
            var asc = order === 'asc',
                tbody = table.find('tbody');
    
            tbody.find('tr').sort(function (a, b) {
                if (asc) {
                    return jQuery('td:first', a).text().localeCompare(jQuery('td:first', b).text());
                } else {
                    return jQuery('td:first', b).text().localeCompare(jQuery('td:first', a).text());
                }
            }).appendTo(tbody);
        }
    }
});
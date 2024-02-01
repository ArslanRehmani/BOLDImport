
define(['N/log'], function (log) {
    return {
        getThirdStepFieldMapLength: function (assistance) {
            var title = 'GetThirdStepFieldMapLength()::';
            try {
                var MapLength = getValueFromSteppers(assistance, 'custpage_ab_filemap', 'custpage_ab_truedata');
                return MapLength;
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        remainingcSVFieldsinMapStep: function (assistance) {
            var title = 'remainingcSVFieldsinMapStep()::';
            try {
                var remainingCSVFields = getValueFromSteppers(assistance, 'custpage_ab_filemap', 'custpage_ab_csvremainingfields');
                return remainingCSVFields;
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        createRecordInnetsuiteFields: function (assistance) {
            var title = 'createRecordInnetsuiteFields()::';
            try {
                var middletablerow = getValueFromSteppers(assistance, 'custpage_ab_filemap', 'custpage_ab_middletablerows');
                return middletablerow;
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        recordType: function (assistance) {
            var title = 'RecordType()::';
            try {
                var recTypelocal = getValueFromSteppers(assistance, 'custpage_ab_filemap', 'custpage_ab_rectypelocalstorage');
                return recTypelocal;
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        getSaveMappingRecIDFunction: function (assistance) {
            var title = 'getSaveMappingRecIDFunction(::)';
            try {
                var saveMappingRecID = getValueFromSteppers(assistance, 'custpage_ab_importopt', 'custpage_ab_save_mapping_rec_id');
                return saveMappingRecID;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        },
        csvDatafromSecondStep: function (assistance) {
            var title = 'csvDatafromSecondStep(::)';
            try {
                var csvData = getValueFromSteppers(assistance, 'custpage_ab_importopt', 'custpage_ab_csvdata');
                return csvData;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        },
        uploadedcsvFileNameSecondStep: function (assistance) {
            var title = 'uploadedcsvFileNameSecondStep(::)';
            try {
                var uploadCsvFileName = getValueFromSteppers(assistance, 'custpage_ab_importopt', 'custpage_ab_csvfile_name');
                return uploadCsvFileName;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        },
        uploadedcsvFileDataSecondStep: function (assistance) {
            var title = 'uploadedcsvFileDataSecondStep(::)';
            try {
                var uploadCsvFileData = getValueFromSteppers(assistance, 'custpage_ab_importopt', 'custpage_ab_csvfile_data');
                return uploadCsvFileData;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        },
        getSelectOption: function (assistance) {
            var title = 'getSelectOption()::';
            try {
                var selectOption = getValueFromSteppers(assistance, 'custpage_ab_importopt', 'custpage_ab_selectoption');
                return selectOption;
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        internalidOBJ: function (assistance) {
            var title = 'internalidOBJ()::';
            try {
                var internalid1or0 = getValueFromSteppers(assistance, 'custpage_ab_filemap', 'custpage_ab_internalidid');
                return internalid1or0;
            } catch (e) {
                log.debug(title + e.message, e.error);
            }
        },
        sortTable: function (table, order) {
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
    function getValueFromSteppers(assistance, stepId, fieldId) {
        var title = 'getValueFromSteppers(::)';
        try {
            var stepper = assistance.getStep({
                id: stepId
            });
            var data = stepper.getValue({
                id: fieldId
            });
            return data;
        } catch (e) {
            log.debug('Exception ' + title, e.message);
        }
    }
});
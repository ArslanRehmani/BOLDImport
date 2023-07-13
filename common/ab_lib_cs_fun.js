
define(['N/log', 'N/record', 'N/file', '../common/ab_lib_convertCSVToJson.js'], function (log, record, file, convertCSVLIB) {
    return {
        getRecordFields: function (recID) {
            var title = 'getRecordFields()::';
            var fields, rec, rank;
            try {
                console.log('recID before ())(', recID);
                if (recID == 'itemfulfillment') {
                    rec = record.load({
                        type: 'itemfulfillment',
                        id: 9077160, //static id need to be change in dynamic
                        isDynamic: false
                    });
                } else {
                    rec = record.create({
                        type: recID,
                        isDynamic: true,
                    });
                }
                if (rec) {
                    console.log('fields before', fields);
                    fields = convertCSVLIB.getRecFields(rec, recID);
                    console.log('fields after', fields);
                    if (fields.bodyfields.length) {
                        return fields;
                    } else {
                        throw new Error('Fields not found please check record id on import custom records');
                    }
                } else {
                    throw new Error('Record Not defined please check record id on import custom records');
                }
            } catch (error) {
                log.error(title + error.name, error.message);
            }
        }
    }
});
define(['N/search'], function (search) {
    return {
        internalId: 'customrecord_ab_bom_import_rec_type',
        fields: {
            NAME: 'custrecord_rec_name',
            ID: 'custrecord_ab_rec_id'
        },
        getList : function () {
            var title = 'getList()::';
            var searchData;
            var self = this;
            var option = {};
            var obj= {};
            try {
                searchData = search.create({
                    type: this.internalId,
                    filters: [
                        ["isinactive", "is", "F"]
                    ],
                    columns: [
                        search.createColumn({
                            name: this.fields.NAME
                        }),
                        search.createColumn({
                            name: this.fields.ID
                        })
                    ]
                });
                searchData.run().each(function (result) {
                    if(!option[result.id]) option[result.id] = {}
                    obj = {}
                    obj.text  = result.getValue({
                        name: self.fields.NAME
                    })
                    obj.value  = result.getValue({
                        name: self.fields.ID
                    })
                    option[result.id] = obj;
                    return true
                });
                return option;
        } catch (error) {
                log.error(title + error.name, error.message)
            }
        }

    };
});
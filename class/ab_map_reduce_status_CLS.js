define(['N/record'], function (record) {
    return {
        Create : function (mapReduceId,taskStatus,id) {
            var title = 'MapReduceStatus()::';
            try {
                
            var mapReduceRevordStatus = record.create({
                        type: 'customrecord_ab_mr_record_status',
                        isDynamic: true
            });
            mapReduceRevordStatus.setValue('custrecord_ab_mr_status_mr_id',mapReduceId);
            mapReduceRevordStatus.setValue('custrecord_ab_mr_status_mr_summary',taskStatus);
            mapReduceRevordStatus.setValue('custrecord_ab_mr_status_csv_data_id',id);
            mapReduceRevordStatus.setValue('custrecord_ab_mr_status_date',new Date());
            var recordId = mapReduceRevordStatus.save({
                enableSourcing: true,
                ignoreMandatoryFields: true
                });
                log.debug({
                    title: '====> Map Reduce Record Status ID',
                    details: recordId
                });    
        } catch (error) {
                log.error(title + error.name, error.message)
            }
        }

    };
});
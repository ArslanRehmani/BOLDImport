
define(['N/log','N/record','N/task'], function (log,record,task) {
    return {
        fields:{
            fieldId: 'custrecord_ab_maped_record_field',
            lineFieldId: 'custrecord_ab_maped_record_linefield'
        },
        recordId:{
            id: 'customrecord_ab_maped_record'
        },
        mapReduceTaskStatus: function (id,rectypetostring,createRecordinArray,UpdateRecord,createRecordLineLeveldata) {
            var title = 'mapReduceTaskStatus()::';
            try {
                var mapReduce = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ap_mr_create_record_csv',
                    deploymentId: 'customdeploy_ap_mr_create_record_csv',
                    params: {
                        'custscript_ab_csv_data_length': id,
                        'custscript_ab_rectype': rectypetostring,
                        'custscript_ab_record_id_array': createRecordinArray,
                        'custscript_ab_select_option': UpdateRecord,
                        'custscript_ab_line_level_data': createRecordLineLeveldata
                    }
                });
                // Submit the map/reduce task
                var mapReduceId = mapReduce.submit();
                return mapReduceId;
            } catch (error) {
                log.error(title + error.name, error.message)
            }
        }
    }
});
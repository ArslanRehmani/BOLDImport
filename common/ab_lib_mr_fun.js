
define(['N/log', 'N/task'], function (log, task) {
    return {
        mapReduceTaskStatus: function (fileCabinetUploadedCsvFileId, recType, bodyFieldsLineFieldsOBJ, UpdateRecord) {
            var title = 'mapReduceTaskStatus(::)';
            try {
                var mapReduce = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ap_mr_create_record_csv',
                    deploymentId: 'customdeploy_ap_mr_create_record_csv',
                    params: {
                        'custscript_ab_upload_csv_file_id': fileCabinetUploadedCsvFileId,
                        'custscript_ab_rectype': recType,
                        'custscript_ab_body_line_field_obj': bodyFieldsLineFieldsOBJ,
                        'custscript_ab_select_option': UpdateRecord,
                    }
                });
                // Submit the map/reduce task
                var mapReduceId = mapReduce.submit();
                return mapReduceId;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
    }
});
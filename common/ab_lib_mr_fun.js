
define(['N/log', 'N/task','../common/ab_lib_setPriorityArray_CLS.js'], function (log, task, setPriorityCLS) {
    return {
        mapReduceTaskStatus: function (fileCabinetUploadedCsvFileId, recType, bodyFieldsLineFieldsOBJ, UpdateRecord, errorFileFolder) {
            var title = 'mapReduceTaskStatus(::)';
            try {
                var priorityBodyLineFieldOBJ = setPriorityCLS.setPriorityArray(bodyFieldsLineFieldsOBJ, recType);
                log.debug({
                    title: 'priorityBodyLineFieldOBJ in ab_lib_mr_fun',
                    details: priorityBodyLineFieldOBJ
                });
                var mapReduce = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ap_mr_create_record_csv',
                    deploymentId: 'customdeploy_ap_mr_create_record_csv',
                    params: {
                        'custscript_ab_upload_csv_file_id': fileCabinetUploadedCsvFileId,
                        'custscript_ab_rectype': recType,
                        'custscript_ab_body_line_field_obj': priorityBodyLineFieldOBJ,
                        'custscript_ab_select_option': UpdateRecord,
                        'custscript_ab_mr_error_file_folder': errorFileFolder
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
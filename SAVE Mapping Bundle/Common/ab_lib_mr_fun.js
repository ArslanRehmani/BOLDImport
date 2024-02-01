
define(['N/log','N/record','N/task','../Common/ab_lib_setPriorityArray_save_map_CLS.js'], function (log,record,task,setPriorityCLS) {
    return {
        fields:{
            fieldId: 'custrecord_ab_maped_record_field',
            lineFieldId: 'custrecord_ab_maped_record_linefield'
        },
        recordId:{
            id: 'customrecord_ab_maped_record'
        },
        mapReduceTaskStatus: function (id,rectypetostring,createRecordinArray,UpdateRecord,saveMappingRecID, errorFileFolder, remainingCsvFields) {
            var title = 'mapReduceTaskStatus()::';
            try {
                var priorityBodyLineFieldOBJ = setPriorityCLS.setPriorityArray(createRecordinArray, rectypetostring);
                log.debug({
                    title: 'priorityBodyLineFieldOBJ in ab_lib_mr_fun',
                    details: priorityBodyLineFieldOBJ
                });
                var mapReduce = task.create({
                    taskType: task.TaskType.MAP_REDUCE,
                    scriptId: 'customscript_ab_mr_create_savemapping_mr',
                    deploymentId: 'customdeploy_ab_mr_create_savemapping_mr',
                    params: {
                        'custscript_ab_upload_csv_id': id,
                        'custscript_ab_sel_rec_type': rectypetostring,
                        'custscript_ab_netsuite_array': priorityBodyLineFieldOBJ,
                        'custscript_ab_update_record': UpdateRecord,
                        'custscript_ab_savemapping_rec_id': saveMappingRecID,
                        'custscript_mr_error_file_folder': errorFileFolder,
                        'custscript_ab_remainingcsvarray': remainingCsvFields
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
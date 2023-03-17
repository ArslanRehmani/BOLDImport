/**
 *@NApiVersion 2.0
 *@NScriptType MapReduceScript
 */
define(['N/log','N/record','N/search','N/task'], function(log,record,search,task) {

    function getInputData() {
        var title = 'getInputData(::)';
        try{
            var obj;
            var array = [];
            // var mapReduceRecStatus = search.load({
            //     id: 'customsearch_mapreduce_rec_status',
            //     type: 'customrecord_ab_mr_record_status'
            // });

            var mapReduceRecStatus = search.create({
                type: "customrecord_ab_mr_record_status",
                filters:
                [
                //    ["custrecord_ab_mr_status_mr_summary","is","PENDING"],
                //    ["custrecord_ab_mr_status_mr_summary","is","PROCESSING"],
                //    "AND", 
                   ["custrecord_ab_mr_status_date","within","today"]
                ],
                columns:
                [
                   search.createColumn({
                      name: "scriptid",
                      sort: search.Sort.ASC,
                      label: "Script ID"
                   }),
                   search.createColumn({name: "custrecord_ab_mr_status_date", label: "Date"}),
                   search.createColumn({name: "custrecord_ab_mr_status_mr_summary", label: "Map Reduce Summary"}),
                   search.createColumn({name: "custrecord_ab_mr_status_csv_data_id", label: "CSD Data ID"}),
                   search.createColumn({name: "custrecord_ab_mr_status_mr_id", label: "Map Reduce ID"})
                ]
             });
            mapReduceRecStatus.run().each(function(result) {
                obj ={};
                obj.internalId = result.id;
                obj.summaryStatus = result.getValue({
                    name: 'custrecord_ab_mr_status_mr_summary'
                });
                obj.mapreduceID = result.getValue({
                    name: 'custrecord_ab_mr_status_mr_id'
                });
                array.push(obj);
                return true;
            });
            log.debug('array',array);
            if(!!array && array.length){
                return array;
            }else{
                log.debug('Search is Empty',array);
            }
            // return array;
        } catch(e) {
            log.debug('Exception ' +title, e.message);
        }
        
    }

    function map(context) {
        var title = 'map(::)';
        try{
            var mapRecData = JSON.parse(context.value);
            log.debug('mapRecData',mapRecData);
            var mrSummary = task.checkStatus({
                taskId: mapRecData.mapreduceID
            });
            var taskStatus = mrSummary.status;
            log.debug(title + 'Task Status', taskStatus);
            if(taskStatus != "PENDING"){
                var recObj = record.load({
                    type: 'customrecord_ab_mr_record_status',
                    id: parseInt(mapRecData.internalId)
                });
                recObj.setValue({fieldId : 'custrecord_ab_mr_status_mr_summary',value: taskStatus});
                recObj.save();
            }
        } catch(e) {
            log.debug('Exception ' +title, e.message);
        }
        
    }

    function reduce(context) {
        
    }

    function summarize(summary) {
        
    }

    return {
        getInputData: getInputData,
        map: map,
        reduce: reduce,
        summarize: summarize
    }
});

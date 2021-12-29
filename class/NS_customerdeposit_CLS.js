define(['N/record'], function (record) {
    return {
        Create : function (csvDatArray,finalArray,NetsuiteIdArray,rectype) {
            var title = 'customerdeposit()::';
            try {
                log.debug({
                    title: 'Record create Function Call in Custome Deposit',
                    details: rectype
                });
                
            var NetsuiteRecordCreate = record.create({
                        type: rectype,
                        isDynamic: true
            });
            
            for (var c=0 ; c<csvDatArray.length ; c++){
                var firstlineobj = csvDatArray[c];
                var NetsuiteRecordCreate = record.create({
                    // type: 'customrecord_ab_payroll_mapping',
                    type: rectype,
                    isDynamic: true
                });
                for(var i = 0 ; i <finalArray.length;i++){
                    var field = finalArray[i];
                    var firstlineKeys = Object.keys(firstlineobj);
                    for(var j = 0 ; j <firstlineKeys.length ;j++){
                            if(firstlineKeys[j] == field){
                                log.debug('FieldSet',field +":"+firstlineobj[firstlineKeys[j]]);
                                
                                if(field == 'date'){
                                    // log.debug(title+'date',firstlineobj[firstlineKeys[j]]);
                                    var date = new Date(firstlineobj[firstlineKeys[j]]);
                                    // log.debug(title+'date//////',date);
                                    // var date1 = new Date('9/15/2021');
                                    // log.debug(title+'date',firstlineobj[firstlineKeys[j]]);
                                    // var day = date1.getDay();
                                    // var month = date1.getMonth()+1;
                                    // var year = date1.getFullYear();
                                    // var formateDate =  month +'/'+ day +'/'+ year;
                                    // log.debug(title+'formateDate',formateDate);
                                    NetsuiteRecordCreate.setValue({
                                        fieldId: NetsuiteIdArray[i],
                                        value: date
                                    });
                                }else{
                                    NetsuiteRecordCreate.setValue({
                                        fieldId: NetsuiteIdArray[i],
                                        value: firstlineobj[firstlineKeys[j]]
                                    });
                                }
                                    
                            }
                    }
                }
                var recordId = NetsuiteRecordCreate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
                });
                
                
            }
            var recordId = NetsuiteRecordCreate.save({
                    enableSourcing: true,
                    ignoreMandatoryFields: true
            });
            log.debug({
                title: 'Record create In NetSuite  ID',
                details: recordId
            })
                
        } catch (error) {
                log.error(title + error.name, error.message)
            }
        }

    };
});
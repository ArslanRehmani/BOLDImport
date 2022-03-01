define(['../class/NS_Cust_Payroll_CLS.js','../class/NS_Cust_Logging_CLS.js','../class/NS_customerdeposit_CLS.js'], function (custPayrollCLS,custLoggingCLS,customerdepositeCLS) {
    return {
        
        recTypeSwitch : function (csvValuesData,finalArray,createRecordinArray,rectype,selectOption) {
            var title = 'recTypeSwitch()::';
            log.debug(title+'rectype',rectype);
            try {
                switch(rectype) {
                    case 'customrecord_ab_payroll_mapping': 
                        log.debug({
                            title: 'selectOption in Controler payroll mapping Update',
                            details: selectOption
                        });
                        if(selectOption == 1){
                            custPayrollCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype);
                        }else{
                            log.debug({
                                title: 'selectOption in Controler payroll mapping ADD',
                                details: selectOption
                            });
                            custPayrollCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype);
                        }
                      break;
                    case 'customrecord_ab_custom_logging':
                        
                        log.debug({
                            title: 'Call to create Logging',
                            details: 'Calling...'
                        });
                        if(selectOption == 1){
                            custLoggingCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype);
                        }else{
                            custLoggingCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype);
                        }
                    break;
                    case 'customerdeposit':
                        
                        log.debug({
                            title: 'Call to create customerdeposit',
                            details: 'Calling...'
                        });
                        if(selectOption == 1){
                            customerdepositeCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype);
                        }else{
                            customerdepositeCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype);
                        }
                      break;
                    default:
                      // code block
                  } 
        } catch (error) {
                log.error(title + error.name, error.message)
            }
        }

    };
});
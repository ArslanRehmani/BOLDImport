define(['../class/NS_Cust_Payroll_CLS.js','../class/NS_Cust_Logging_CLS.js','../class/NS_customerdeposit_CLS.js'], function (custPayrollCLS,custLoggingCLS,customerdepositeCLS) {
    return {
        
        recTypeSwitch : function (csvValuesData,finalArray,createRecordinArray,rectype) {
            var title = 'recTypeSwitch()::';
            log.debug(title+'rectype',rectype);
            try {
                switch(rectype) {
                    case 'customrecord_ab_payroll_mapping':
                        custPayrollCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype);
                        log.debug({
                            title: 'Call to create Payroll',
                            details: 'Calling...'
                        });
                        log.debug({
                            title: 'csvDatArrayl in Controller',
                            details: csvValuesData
                        })
                      break;
                    case 'customrecord_ab_custom_logging':
                        custLoggingCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype);
                        log.debug({
                            title: 'Call to create Logging',
                            details: 'Calling...'
                        })
                    break;
                    case 'customerdeposit':
                        customerdepositeCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype);
                        log.debug({
                            title: 'Call to create customerdeposit',
                            details: 'Calling...'
                        })
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
define(['../class/NS_Cust_Payroll_CLS.js','../class/NS_Cust_Logging_CLS.js','../class/NS_customerdeposit_CLS.js'], function (custPayrollCLS,custLoggingCLS,customerdepositeCLS) {
    return {
        
        recTypeSwitch : function (csvDatArray,finalArray,NetsuiteIdArray,rectype) {
            var title = 'recTypeSwitch()::';
            log.debug(title+'rectype',rectype);
            try {
                switch(rectype) {
                    case 'customrecord_ab_payroll_mapping':
                        custPayrollCLS.Create(csvDatArray,finalArray,NetsuiteIdArray,rectype);
                        log.debug({
                            title: 'Call to create Payroll',
                            details: 'Calling...'
                        })
                      break;
                    case 'customrecord_ab_custom_logging':
                        custLoggingCLS.Create(csvDatArray,finalArray,NetsuiteIdArray,rectype);
                        log.debug({
                            title: 'Call to create Logging',
                            details: 'Calling...'
                        })
                    break;
                    case 'customerdeposit':
                        customerdepositeCLS.Create(csvDatArray,finalArray,NetsuiteIdArray,rectype);
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
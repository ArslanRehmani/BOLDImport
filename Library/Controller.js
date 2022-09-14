define(['../class/NS_Cust_Payroll_CLS.js','../class/NS_Cust_Logging_CLS.js','../class/NS_customerdeposit_CLS.js','../class/NS_salesOrder_CLS.js'], function (custPayrollCLS,custLoggingCLS,customerdepositeCLS,salesOrderCLS) {
    return {
        
        recTypeSwitch : function (csvValuesData,finalArray,createRecordinArray,rectype,selectOption,LineLevelData) {
            var title = 'recTypeSwitch()::';
            log.debug(title+'rectype',rectype);
            try {
                switch(rectype) {
                    case 'customrecord_ab_payroll_mapping': 
                        if(selectOption == 1){
                            custPayrollCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }else{
                            custPayrollCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'salesorder': 
                        if(selectOption == 1){
                            salesOrderCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }else{
                            salesOrderCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'customrecord_ab_custom_logging':
                        if(selectOption == 1){
                            custLoggingCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }else{
                            custLoggingCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }
                    break;
                    case 'customerdeposit':
                        if(selectOption == 1){
                            customerdepositeCLS.Update(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
                        }else{
                            customerdepositeCLS.Create(csvValuesData,finalArray,createRecordinArray,rectype,LineLevelData);
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
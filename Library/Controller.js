define(['../class/NS_Cust_Payroll_CLS.js','../class/NS_customerdeposit_CLS.js','../class/NS_itemFulfillment_CLS.js','../class/NS_workOrder_CLS .js','../class/ab_CLS_custPayment.js','../class/NS_binTransfer_CLS.js','../class/ab_CLS_subscription.js','../class/NS_InterCompanyTransferOrder_CLS.js'],
 function (custPayrollCLS,customerdepositeCLS,itemFulfillmentCLS,workOrderCLS,custPayCLS,binTransferCLS,subscriptionCLS,interCompanyTransferCLS) {
    return {
        
        recTypeSwitch : function (csvValuesData,createRecordinArray,rectype,selectOption,LineLevelData) {
            var title = 'recTypeSwitch()::';
            log.debug(title+'rectype',rectype);
            try {
                switch(rectype) {
                    case 'customrecord_ab_payroll_mapping': 
                        if(selectOption == 1){
                            custPayrollCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            custPayrollCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'itemfulfillment': 
                        if(selectOption == 1){
                            itemFulfillmentCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            itemFulfillmentCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'customerdeposit':
                        if(selectOption == 1){
                            customerdepositeCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            customerdepositeCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'workorder':
                        if(selectOption == 1){
                            workOrderCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            workOrderCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'customerpayment':
                        if(selectOption == 1){
                            custPayCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            custPayCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'bintransfer':
                        if(selectOption == 1){
                            binTransferCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            binTransferCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'subscription':
                        if(selectOption == 1){
                            subscriptionCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            subscriptionCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }
                      break;
                    case 'intercompanytransferorder':
                        if(selectOption == 1){
                            interCompanyTransferCLS.Update(csvValuesData,createRecordinArray,rectype,LineLevelData);
                        }else{
                            interCompanyTransferCLS.Create(csvValuesData,createRecordinArray,rectype,LineLevelData);
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
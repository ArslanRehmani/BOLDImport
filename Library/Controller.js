define(['../class/NS_Cust_Payroll_CLS.js', '../class/NS_customerdeposit_CLS.js', '../class/NS_itemFulfillment_CLS.js', '../class/NS_workOrder_CLS .js', '../class/ab_CLS_custPayment.js', '../class/NS_binTransfer_CLS.js', '../class/ab_CLS_subscription.js', '../class/NS_InterCompanyTransferOrder_CLS.js', '../class/ab_CLS_chargeRecord.js'],
    function (custPayrollCLS, customerdepositeCLS, itemFulfillmentCLS, workOrderCLS, custPayCLS, binTransferCLS, subscriptionCLS, interCompanyTransferCLS, chargeCLS) {
        return {

            recTypeSwitch: function (csvValuesData, bodyFieldsLineFieldsOBJ, rectype, selectOption) {
                var title = 'recTypeSwitch(::)';
                try {
                    switch (rectype) {
                        case 'customrecord_ab_payroll_mapping':
                            if (selectOption == 1) {
                                custPayrollCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                custPayrollCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'itemfulfillment':
                            if (selectOption == 1) {
                                itemFulfillmentCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                itemFulfillmentCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'customerdeposit':
                            if (selectOption == 1) {
                                customerdepositeCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                customerdepositeCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'workorder':
                            if (selectOption == 1) {
                                workOrderCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                workOrderCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'customerpayment':
                            if (selectOption == 1) {
                                custPayCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                custPayCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'bintransfer':
                            if (selectOption == 1) {
                                binTransferCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                binTransferCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'subscription':
                            if (selectOption == 1) {
                                subscriptionCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                subscriptionCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'intercompanytransferorder':
                            if (selectOption == 1) {
                                interCompanyTransferCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                interCompanyTransferCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        case 'charge':
                            if (selectOption == 1) {
                                chargeCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            } else {
                                chargeCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype);
                            }
                            break;
                        default:
                        // code block
                    }
                } catch (e) {
                    log.debug('Exception ' + title, e.message);
                }
            }

        };
    });
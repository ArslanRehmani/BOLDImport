define(['../class/NS_Cust_Payroll_CLS.js', '../class/NS_customerdeposit_CLS.js', '../class/NS_itemFulfillment_CLS.js', '../class/NS_workOrder_CLS .js', '../class/ab_CLS_custPayment.js', '../class/NS_binTransfer_CLS.js', '../class/ab_CLS_subscription.js', '../class/NS_InterCompanyTransferOrder_CLS.js', '../class/ab_CLS_chargeRecord.js', '../class/NS_transferOrder_CLS.js', '../class/NS_standardCLS_createRecord_throughBIT.js'],
    function (custPayrollCLS, customerdepositeCLS, itemFulfillmentCLS, workOrderCLS, custPayCLS, binTransferCLS, subscriptionCLS, interCompanyTransferCLS, chargeCLS, transferOrderClass, NS_StandardCLS) {
        return {

            recTypeSwitch: function (csvValuesData, bodyFieldsLineFieldsOBJ, rectype, selectOption, errorFileFolder) {
                var title = 'recTypeSwitch(::)';
                try {
                    switch (rectype) {
                        case 'customrecord_ab_payroll_mapping':
                            if (selectOption == 1) {
                                custPayrollCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                custPayrollCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'itemfulfillment':
                            if (selectOption == 1) {
                                // itemFulfillmentCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                // itemFulfillmentCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'customerdeposit':
                            if (selectOption == 1) {
                                customerdepositeCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                customerdepositeCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'workorder':
                            if (selectOption == 1) {
                                // workOrderCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                // workOrderCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'customerpayment':
                            if (selectOption == 1) {
                                custPayCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                custPayCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'bintransfer':
                            if (selectOption == 1) {
                                // binTransferCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                // binTransferCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'subscription':
                            if (selectOption == 1) {
                                subscriptionCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                subscriptionCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'intercompanytransferorder':
                            if (selectOption == 1) {;
                                // interCompanyTransferCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                // interCompanyTransferCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'charge':
                            if (selectOption == 1) {
                                chargeCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                chargeCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'transferorder':
                            if (selectOption == 1) {
                                // transferOrderClass.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                // transferOrderClass.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                                NS_StandardCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            }
                            break;
                        case 'salesorder':
                            if (selectOption == 1) {
                                NS_StandardCLS.Update(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
                            } else {
                                NS_StandardCLS.Create(csvValuesData, bodyFieldsLineFieldsOBJ, rectype, errorFileFolder);
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
        function priorityObjFun(bodyFieldsLineFieldsOBJ, priorityArray) {
            var title = 'priorityArrayFun(::)';
            try {
                var data = JSON.parse(bodyFieldsLineFieldsOBJ);
                var newBodyFields = priorityArray.reduce(function (result, csvField) {
                    var matchingObjIndex = -1;

                    for (var i = 0; i < data.bodyFields.length; i++) {
                        if (data.bodyFields[i].csvField === csvField) {
                            matchingObjIndex = i;
                            break;
                        }
                    }

                    if (matchingObjIndex !== -1) {
                        result.push(data.bodyFields[matchingObjIndex]);
                        data.bodyFields.splice(matchingObjIndex, 1);
                    }

                    return result;
                }, []);

                // Concatenate the remaining objects
                newBodyFields = newBodyFields.concat(data.bodyFields);

                // Update the data with the reordered bodyFields
                data.bodyFields = newBodyFields;
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
            return data || {};
        }
    });
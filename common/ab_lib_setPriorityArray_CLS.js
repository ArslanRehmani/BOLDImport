define([],
    function () {
        return {

            setPriorityArray: function (bodyFieldsLineFieldsOBJ, rectype) {
                var title = 'setPriorityArray(::)';
                try {
                    switch (rectype) {
                        case 'intercompanytransferorder':
                                var priorityArray = ['To Subsidiary'];
                                var priorityBodyFieldsLineFieldsOBJ = priorityObjFun(bodyFieldsLineFieldsOBJ, priorityArray);
                                return priorityBodyFieldsLineFieldsOBJ;
                        case 'transferorder':
                                var priorityArray = ['Subsidiary'];
                                var priorityBodyFieldsLineFieldsOBJ = priorityObjFun(bodyFieldsLineFieldsOBJ, priorityArray);
                                return priorityBodyFieldsLineFieldsOBJ;
                        case 'workorder':
                                var priorityArray = ['Subsidiary'];
                                var priorityBodyFieldsLineFieldsOBJ = priorityObjFun(bodyFieldsLineFieldsOBJ, priorityArray);
                                return priorityBodyFieldsLineFieldsOBJ;
                        case 'salesorder':
                                return bodyFieldsLineFieldsOBJ;
                        case 'itemfulfillment':
                                return bodyFieldsLineFieldsOBJ;
                        case 'bintransfer':
                                return bodyFieldsLineFieldsOBJ;
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
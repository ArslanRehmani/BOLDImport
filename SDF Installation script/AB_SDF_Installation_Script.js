/**
 * @NAPIVersion 2.1
 * @NScriptType SDFInstallationScript
 */
define(['N/log', 'N/record', 'N/search'],
    /**
 * @param{log} log
 * @param{record} record
 * @param{search} search
 */
    (log, record, search) => {
        /**
         * Defines what is executed when the script is specified by the SDF deployment(in the deploy.xml file of a SuiteCloud project).
         * @param {Object} scriptContext
         * @param {fromVersion} scriptContext.fromVersion - The version of the SuiteApp currently installed on the account. Specify null
         *     if this is a new installation.
         * @param {toVersion} scriptContext.toVersion - The version of the SuiteApp that will be installed on the account.
         * @since 2015.2
         */
        const run = (scriptContext) => {
            var title = 'SDFInstallationScript(::) RUN';
            try {
                // Suitelet Internal ID search
                var slInternalIdSEarch = [];
                var scriptdeploymentSearchObj = search.create({
                    type: "scriptdeployment",
                    filters:
                        [
                            ["title", "is", "CSV Import"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({
                                name: "title",
                                sort: search.Sort.ASC,
                                label: "Title"
                            })
                        ]
                });
                scriptdeploymentSearchObj.run().each(function (result) {
                    slInternalIdSEarch.push(result.id);
                    return true;
                });
                log.debug({
                    title: 'slInternalIdSEarch',
                    details: slInternalIdSEarch
                });


                //Folder Internal ID Array
                var folderIDArray = [];
                var folderSearchObj = search.create({
                    type: "folder",
                    filters:
                        [
                            ["name", "contains", "Error File Folder"],
                            "OR",
                            ["name", "contains", "Upload CSV Excel formate Folder"],
                            "OR",
                            ["name", "contains", "Uploaded CSV Files Folder"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" }),
                            search.createColumn({
                                name: "name",
                                sort: search.Sort.ASC,
                                label: "Name"
                            })
                        ]
                });
                folderSearchObj.run().each(function (result) {
                    folderIDArray.push(result.id);
                    return true;
                });
                log.debug({
                    title: 'folderIDArray',
                    details: folderIDArray
                });


                //set param in SL scripts
                if (slInternalIdSEarch && slInternalIdSEarch.length > 0) {
                    var rec = record.load({
                        type: record.Type.SCRIPT_DEPLOYMENT,
                        id: slInternalIdSEarch[0]
                    });
                    rec.setValue({
                        fieldId: 'custscript_ab_error_file_folder',
                        value: folderIDArray[0]
                    });
                    rec.setValue({
                        fieldId: 'custscriptab_csv_excel_folder_id',
                        value: folderIDArray[1]
                    });
                    rec.setValue({
                        fieldId: 'custscript_csv_data_folder_id',
                        value: folderIDArray[2]
                    });
                    var DeploymentId = rec.save();
                    log.debug({
                        title: 'DeploymentId',
                        details: DeploymentId
                    });
                }
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
        return {run}
    });

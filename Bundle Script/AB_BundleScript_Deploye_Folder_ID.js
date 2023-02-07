/**
 *@NApiVersion 2.0
 *@NScriptType BundleInstallationScript
 */
define(['N/search', 'N/record'], function (search, record) {
    return {
        afterInstall: function (toversion) {
            var title = 'afterInstall(::)';
            try {
                var boldFolderArrayId = [];
                var scriptDeploymentIdArray = [];
                var BoldImportFolderId = search.create({
                    type: "folder",
                    filters:
                        [
                            ["name", "contains", "BoldImport-2.0"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                });
                BoldImportFolderId.run().each(function (result) {
                    boldFolderArrayId.push(result.id);
                    return true;
                });
                log.debug('boldFolderArrayId', boldFolderArrayId);


                var scriptDeploymentId = search.create({
                    type: "scriptdeployment",
                    filters:
                        [
                            ["title", "is", "CSV Import"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                });
                scriptDeploymentId.run().each(function (result) {
                    scriptDeploymentIdArray.push(result.id);
                    return true;
                });
                log.debug('scriptDeploymentIdArray', scriptDeploymentIdArray);
                var rec = record.load({
                    type: record.Type.SCRIPT_DEPLOYMENT,
                    id: scriptDeploymentIdArray[0]
                });
                rec.setValue({
                    fieldId: 'custscript_csv_data_folder_id',
                    value: boldFolderArrayId[0]
                });
                var DeploymentId = rec.save();
                log.debug({
                    title: 'DeploymentId',
                    details: DeploymentId
                });
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        },
        afterUpdate: function (toversion) {
            var title = 'afterUpdate(::)';
            try {
                var boldFolderArrayId = [];
                var scriptDeploymentIdArray = [];
                var BoldImportFolderId = search.create({
                    type: "folder",
                    filters:
                        [
                            ["name", "contains", "BoldImport-2.0"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                });
                BoldImportFolderId.run().each(function (result) {
                    boldFolderArrayId.push(result.id);
                    return true;
                });
                log.debug('boldFolderArrayId', boldFolderArrayId);


                var scriptDeploymentId = search.create({
                    type: "scriptdeployment",
                    filters:
                        [
                            ["title", "is", "CSV Import"]
                        ],
                    columns:
                        [
                            search.createColumn({ name: "internalid", label: "Internal ID" })
                        ]
                });
                scriptDeploymentId.run().each(function (result) {
                    scriptDeploymentIdArray.push(result.id);
                    return true;
                });
                log.debug('scriptDeploymentIdArray', scriptDeploymentIdArray);
                var rec = record.load({
                    type: record.Type.SCRIPT_DEPLOYMENT,
                    id: scriptDeploymentIdArray[0]
                });
                rec.setValue({
                    fieldId: 'custscript_csv_data_folder_id',
                    value: boldFolderArrayId[0]
                });
                var DeploymentId = rec.save();
                log.debug({
                    title: 'DeploymentId',
                    details: DeploymentId
                });
            } catch (e) {
                log.debug('Exception ' + title, e.message);
            }
        }
    }
});

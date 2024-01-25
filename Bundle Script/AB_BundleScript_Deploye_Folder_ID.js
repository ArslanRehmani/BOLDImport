/**
 *@NApiVersion 2.0
 *@NScriptType BundleInstallationScript
 *
 *The following javascript code is created by ALPHABOLD Consultants LLC, 
 * a NetSuite Partner. It is a SuiteFlex component containing custom code 
 * intended for NetSuite (www.netsuite.com) and use the SuiteScript API. 
 * The code is provided "as is": ALPHABOLD Inc. shall not be liable 
 * for any damages arising out the intended use or if the code is modified 
 * after delivery. 
 * 
 * Company:		ALPHABOLD Consultants LLC, www.AlphaBOLDconsultants.com 
 * Author:		marslan@AlphaBOLD.com 
 * File:		AB_BundleScript_Deploye_FolderID.js
 * Date:		01/01/2022
 * 
 ***********************************************************************/
define(['N/search', 'N/record','N/log'], function (search, record, log) {
    return {
        afterInstall: function (toversion) {
            var title = 'afterInstall(::)';
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
        },
        afterUpdate: function (toversion) {
            var title = 'afterUpdate(::)';
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
    }
});

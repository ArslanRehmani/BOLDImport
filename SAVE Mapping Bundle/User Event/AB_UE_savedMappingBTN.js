
/**
 *@NApiVersion 2.0
 *@NScriptType UserEventScript
 *
*********************************************************************** 
 * 
 * The following javascript code is created by ALPHABOLD Consultants LLC, 
 * a NetSuite Partner. It is a SuiteFlex component containing custom code 
 * intended for NetSuite (www.netsuite.com) and use the SuiteScript API. 
 * The code is provided "as is": ALPHABOLD Inc. shall not be liable 
 * for any damages arising out the intended use or if the code is modified 
 * after delivery. 
 * 
 * Company:		ALPHABOLD Consultants LLC, www.AlphaBOLDconsultants.com 
 * Author:		marslan@AlphaBOLD.com 
 * File:		AB_UE_saveMappingBTN.js
 * Date:		01/01/2022
 * 
 ***********************************************************************/
define(['N/log'], function (log) {

	/**
	 * Entry point function
	 * @param context
	 */
	function beforeLoad(context) {
		var title = 'beforeLoad(::)';
		try {
			var currentRecord = context.newRecord;
			var recid = currentRecord.id;
			log.debug('context.type', context.type);
			var recType = currentRecord.getValue({ fieldId: 'custrecord_create_rec_type' });
			log.debug('recType', recType);
			if (context.type == context.UserEventType.VIEW) {
				addbutton(context, recid, recType)
			}
		} catch (e) {
			log.debug('Exception ' + title, e.message);
		}
	}
	/** 
	 * This function add a button on save mapping custom record 
	 * 
	 * @author marslan@AlphaBOLDconsultants.com 
	 * @param [context] context
	 * @param [string] recid
	 * @param [string] recType
	 * @return null 
	 * 
	*/
	function addbutton(context, recid, recType) {
		var title = 'addbutton(::)';
		try {
			var form = context.form;
			form.clientScriptFileId = 91259;
			form.addButton({ id: "custpage_save_mapping_btn", label: "Use Saved Mapping", functionName: "useSaveMappingFun('" + recid + "','" + recType + "')" });
		} catch (e) {
			log.debug('Exception ' + title, e.message);
		}
	}

	return {
		beforeLoad: beforeLoad,
	}

});
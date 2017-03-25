/**
 * @author: John Schultz
 * @date: 2017-03-23
 * @description: Controller for doggy door components
 * @log:
 * ----------------------------------------------------------------------------
 * Developer       Date          Description
 * ----------------------------------------------------------------------------
 * John Schultz    2017-03-23    Newly created
 * John Schultz    2017-03-25    Renaming
 */
public without sharing class DDA_Controller {
	
	/**
	* @author: John Schultz
	* @date: 2017-03-23
	* @description: Return list of activities within date range.
	* @param: fromTimeStamp - Decimal
	* @param: toTimeStamp - Decimal
	* @return: List of Doggy_Door_Activity__c records.
	*/
	@AuraEnabled
	public static List<Doggy_Door_Activity__c> getActivitiesByDateRange(Decimal fromTimeStamp, Decimal toTimeStamp) {
		return DDA_Service.getActivitiesByDateRange(fromTimeStamp, toTimeStamp);
	}
}
/**
 * @author: John Schultz
 * @date: 2017-03-19
 * @description: Service class for Doggy Door Activity object.
 * @log:
 * ----------------------------------------------------------------------------
 * Developer       Date          Description
 * ----------------------------------------------------------------------------
 * John Schultz    2017-03-19    Newly created
 * John Schultz    2017-03-23    Adding getActivitiesByDateRange method
 * John Schultz    2017-03-25    Renaming
 */
public class DDA_Service {
	
	/**
	* @author: John Schultz
	* @date: 2017-03-23
	* @description: Retrieves activity records within date range.
	* @param: fromTimeStamp - Decimal
	* @param: toTimeStamp - Decimal
	* @return: List of Doggy_Door_Activity__c records.
	*/
	public static List<Doggy_Door_Activity__c> getActivitiesByDateRange(Decimal fromTimeStamp, Decimal toTimeStamp) {
		return [SELECT
		            Id,
		            Day__c,
		            Hour__c,
		            TimeStamp__c
		        FROM Doggy_Door_Activity__c
		        WHERE 
		            TimeStamp__c >= :fromTimeStamp
		            AND TimeStamp__c <= :toTimeStamp
		        ORDER BY TimeStamp__c ASC
		       ];
	}
	
}
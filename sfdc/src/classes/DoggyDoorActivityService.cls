/**
 * @author: John Schultz
 * @date: 2017-03-19
 * @description: Service class for Doggy Door Activity object.
 * @log:
 * ----------------------------------------------------------------------------
 * Developer       Date          Description
 * ----------------------------------------------------------------------------
 * John Schultz    2017-03-19    Newly created
 */
public class DoggyDoorActivityService {
	
	/**
	* @author: John Schultz
	* @date: 2017-03-19
	* @description: Creates a single activity record
	* @return: Doggy_Door_Activity__c
	*/
	public static Doggy_Door_Activity__c create() {
		Doggy_Door_Activity__c dda = new Doggy_Door_Activity__c();
		
		insert dda;
		
		return dda;
	}
	
}

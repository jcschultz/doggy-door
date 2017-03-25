@isTest
private class DDA_ControllerTest {
	
	static List<Doggy_Door_Activity__c> activities;
	
	static {
		// inserting 10 records with dummy timestamps 1-10
		activities = new List<Doggy_Door_Activity__c>();
		
		for (Integer i = 1; i < 11; i++) {
			Doggy_Door_Activity__c d = new Doggy_Door_Activity__c(
				TimeStamp__c = Decimal.valueOf(i)
			);
			
			activities.add(d);
		}
		
		insert activities;
	}
	
	/**
	* @author: John Schultz
	* @date: 2017-03-25
	* @description: Testing retrieval with timestamps between 1 
	*               and 5 to test that only valid results were returned. 
	*/
	@isTest static void testActivityRetrieval() {
		List<Doggy_Door_Activity__c> results = DDA_Controller.getActivitiesByDateRange(1.0, 5.0);
		
		// test that not all were retrieved.
		System.assertNotEquals(activities.size(), results.size());
		
		// test that only 5 were retrieved (with timestamps between 1 and 5)
		System.assertEquals(5, results.size());
	}
	
}
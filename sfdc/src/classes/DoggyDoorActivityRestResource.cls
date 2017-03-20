/**
 * @author: John Schultz
 * @date: 2017-03-19
 * @description: Rest Resource class for the Doggy Door Activity Tracker
 * @log:
 * ----------------------------------------------------------------------------
 * Developer       Date          Description
 * ----------------------------------------------------------------------------
 * John Schultz    2017-03-19    Newly created
 */
@RestResource(urlMapping='/DoggyDoorActivity/*')
global class DoggyDoorActivityRestResource  {
	
	/**
	* @author: John Schultz
	* @date: 2017-03-19
	* @description: POST method for creating a single activity record.
	* @return: DDAResponse
	*/
	@HttpPost
	global static DDAResponse create() {
		DDAResponse response = new DDAResponse();
		response.isSuccess = false;
		
		try {
			DoggyDoorActivityService.create();
			response.isSuccess = true;
		}
		catch (Exception e) {
			response.msg = e.getMessage();
		}
		
		return response;
	}
	
	
	/**
	* @author: John Schultz
	* @date: 2017-03-19
	* @description: Response wrapper class
	*/
	global class DDAResponse {
		global Boolean isSuccess;
		global String msg;
	}
}

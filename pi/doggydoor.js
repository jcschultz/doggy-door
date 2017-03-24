// loading modules/libraries
var jsforce = require('jsforce');
var gpio = require('rpi-gpio');

// GPIO pin number
const GPIO_PIN = 7;

// how frequently (in milliseconds) should the door be checked
const CHECKER_FREQUENCY = 400;

// salesforce variables
const SOBJECT_NAME = 'Doggy_Door_Activity__c';
var sfdc = {
	clientId : '',
	clientSecret : '',
	redirectUri : '',
	instanceUrl : '',
	accessToken : '',
	refreshToken : ''
};

// variables for tracking last door status
const STATE_OPEN = 'OPEN';
const STATE_CLOSED = 'CLOSED';
var previousDoorState = STATE_CLOSED;

// utility variables
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
* @author: John Schultz
* @date: 2017-03-23
* @description: Checks the status of the door sensor by calling gpio methods. 
*/
function checkDoorStatus() {
	gpio.read(GPIO_PIN, function(err, value){
		var currentState;
		
		if (err) {
			console.error('ERROR READING DOOR: ' + err);
		}
		else {
			currentState = value ? STATE_CLOSED : STATE_OPEN;
			
			if (previousDoorState != currentState) {
				previousDoorState = currentState;
				
				if (currentState === STATE_OPEN) {
					notifySalesforce(currentState);					
				}
			}
		}
	});
	
	// re-run this function at a set interval
	setTimeout(checkDoorStatus, CHECKER_FREQUENCY);
}

/**
* @author: John Schultz
* @date: 2017-03-23
* @description: Creates a salesforce Oauth connection and inserts a new record.
* @param: status - String.
*/
function notifySalesforce(status) {
	console.log('Notifying salesforce... ' + status);
	var dateObj = new Date();
	var timeStamp = dateObj.getTime();
	var hour = dateObj.getHours();
	var day = WEEKDAYS[dateObj.getDay()];
	
	var conn = new jsforce.Connection({
		oauth2 : {
			clientId : sfdc.clientId,
			clientSecret : sfdc.clientSecret,
			redirectUri : sfdc.redirectUri
		},
		instanceUrl : sfdc.instanceUrl,
		accessToken : sfdc.accessToken,
		refreshToken : sfdc.refreshToken
	});
	
	conn.on('refresh', function(accessToken, res){
		sfdc.accessToken = accessToken;
	});
	
	conn.sobject(SOBJECT_NAME).create(
		{
			Timestamp__c : timeStamp,
			Hour__c : hour,
			Day__c : day
		}, 
		function(err, ret){
			if (err || !ret.success) {
				console.error(err, ret);
			}
			else {
				console.log('Created doggy door activity. ID: ' + ret.id);
			}
		}
	);
}


// start process
console.log('Starting doggy door checker...');
gpio.setup(GPIO_PIN, gpio.DIR_IN, checkDoorStatus);

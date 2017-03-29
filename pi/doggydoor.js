// loading modules/libraries
var jsforce = require('jsforce');
var gpio = require('rpi-gpio');
var email = require('emailjs/email');

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

// gmail variables
const EMAIL_TO_NOTIFY = ''; // email address of where the notifications should be sent.
const EMAIL_SENDER = ''; // email address of where the notifications should come from.
var gmail = email.server.connect({
	user : '', // email address
	password : '',
	host : '',
	ssl : true
});

// variables for tracking last door status
const STATE_OPEN = 'OPEN';
const STATE_CLOSED = 'CLOSED';
var previousDoorState = STATE_CLOSED;
var didSendStuckEmail = false;
var didSendErrorEmail = false;
var openTimeStamp;

// utility variables
const WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
* @author: John Schultz
* @date: 2017-03-23
* @description: Checks the status of the door sensor by calling gpio methods. 
*/
function checkDoorStatus() {
	gpio.read(GPIO_PIN, function(err, value){
		var dateObj = new Date();
		var currentState;
		
		if (err) {
			console.error('ERROR READING DOOR: ' + err);
			emailError(err, null);
		}
		else {
			currentState = value ? STATE_CLOSED : STATE_OPEN;
			
			if (previousDoorState != currentState) {
				// door has just opened or closed.
				previousDoorState = currentState;
				
				// door has changed from closed to open
				if (currentState === STATE_OPEN) {
					notifySalesforce(currentState, dateObj);
					updateFirstOpenTimeStamp(dateObj);
				}
			}
			else if (currentState === STATE_OPEN) {
				// door was and is open.
				if (checkIfStuckOpen(dateObj)) {
					// door is stuck open
					emailDoorStuckOpen();
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
* @param: dateObj - Date object.
*/
function notifySalesforce(status, dateObj) {
	console.log('Notifying salesforce... ' + status);
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
				emailError(err, ret);
			}
			else {
				console.log('Created doggy door activity. ID: ' + ret.id);
			}
		}
	);
}

/**
* @author: John Schultz
* @date: 2017-03-28
* @description: Updates the timestamp of the first time the door is opened.
* @param: dateObj - Date object
*/
function updateFirstOpenTimeStamp(dateObj) {
	openTimeStamp = dateObj.getTime();
	didSendStuckEmail = false;
}

/**
* @author: John Schultz
* @date: 2017-03-28
* @description: Compares current timestamp with first time the door opened to see if it has been stuck open for longer than 5 minutes.
* @param: dateObj - Date object.
* @return: Boolean
*/
function checkIfStuckOpen(dateObj) {
	var fiveMinutes = 300000;
	var timeStamp = dateObj.getTime();
	
	// return true if the door has been open longer than 5 minutes
	return (timeStamp - openTimeStamp > fiveMinutes);
}

/**
* @author: John Schultz
* @date: 2017-03-28
* @description: Sends an email to alert that the door is stuck open if one hasn't already been sent.
*/
function emailDoorStuckOpen() {
	if (!didSendStuckEmail) {
		var subject,
			body;
		
		subject = 'The doggy door is stuck open!';
		
		body = 'The doggy door has been stuck open for more than 5 minutes.';
		
		// set to true so that we only get 1 email notification about it being stuck open.
		didSendStuckEmail = true;
		
		sendEmail(subject, body);
	}
}

/**
* @author: John Schultz
* @date: 2017-03-28
* @description: Sends an email about errors.
* @param: err - Error message.
* @param: resp - Optional response object.
*/
function emailError(err, resp) {
	if (!didSendErrorEmail) {
		var subject,
			body;
		
		subject = 'Doggy Door App Error';
		
		body = 'There is an error with the Doggy Door App.\r\r\r\r';
		body += 'Error: ' + err;
		
		if (resp) {
			body += '\r\r';
			body += 'Response: ' + JSON.stringify(resp);
		}
		
		// set to true so that we only get 1 email notification about an error.
		didSendErrorEmail = true;
		
		sendEmail(subject, body);
	}
}

/**
* @author: John Schultz
* @date: 2017-03-28
* @description: Sends email when the doggy door app starts.
*/
function emailStartup() {
	var subject = 'Doggy Door App Starting Up';
	var body = 'The Doggy Door App has just started.';
	sendEmail(subject, body);
}

/**
* @author: John Schultz
* @date: 2017-03-28
* @description: Sends emails.
* @param: emailSubject - String. Email subject line.
* @param: emailBody - String. Email body.
*/
function sendEmail(emailSubject, emailBody) {
	gmail.send(
		{
			to : EMAIL_TO_NOTIFY,
			from : EMAIL_SENDER,
			subject : emailSubject,
			text : emailBody
		},
		function(err, message) {
			console.log(err || message);
		}
	);
}


// start process
console.log('Starting doggy door checker...');
emailStartup();
gpio.setup(GPIO_PIN, gpio.DIR_IN, checkDoorStatus);

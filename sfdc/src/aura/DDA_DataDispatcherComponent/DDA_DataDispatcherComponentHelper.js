({
	EVENT_TYPE_SPINNER : 'SPINNER',
	EVENT_TYPE_ERROR : 'ERROR',
	EVENT_SHOW : 'SHOW',
	EVENT_HIDE : 'HIDE',
	
	dispatchRecords : function(component, event, helper, records) {
		var dispatchEvent = $A.get('e.c:DDA_DataDispatcherEvent');
		
		dispatchEvent.setParams({
			'records' : records
		});
		
		dispatchEvent.fire();
	},
	
	fireLayoutUpdateEvent : function(component, event, helper, eventParams) {
		var layoutUpdateRequestEvent = $A.get('e.c:DDA_LayoutUpdateRequestEvent');
		layoutUpdateRequestEvent.setParams(eventParams);
		layoutUpdateRequestEvent.fire();
	},
	
	getRecords : function(component, event, helper, fromTimeStamp, toTimeStamp) {
		var action = component.get('c.getActivitiesByDateRange');
		
		action.setParams({
			'fromTimeStamp' : fromTimeStamp,
			'toTimeStamp' : toTimeStamp
		});
		
		action.setCallback(this, function(response){
			var returnValue = response.getReturnValue();
			var state = response.getState();
			
			if (state === 'SUCCESS') {
				helper.dispatchRecords(component, event, helper, returnValue);
			}
			else {
				helper.showError(component, event, helper, response.getError());
			}
			// console.log('response', response);
			
			helper.hideSpinner(component, event, helper);
			
		});
		
		helper.showSpinner(component, event, helper);
		helper.hideError(component, event, helper);
		
		$A.enqueueAction(action);
	},
	
	handleDateRangeUpdateEvent : function(component, event, helper) {
		var fromTimeStamp = event.getParam('fromTimeStamp');
		var toTimeStamp = event.getParam('toTimeStamp');
		
		helper.getRecords(component, event, helper, fromTimeStamp, toTimeStamp);
	},
	
	hideError : function(component, event, helper) {
		helper.fireLayoutUpdateEvent(
			component, 
			event, 
			helper, 
			{
				'eventType' : helper.EVENT_TYPE_ERROR,
				'showOrHide' : helper.EVENT_HIDE,
				'message' : ''
			}
		);
	},
	
	hideSpinner : function(component, event, helper) {
		helper.fireLayoutUpdateEvent(
			component, 
			event, 
			helper, 
			{
				'eventType' : helper.EVENT_TYPE_SPINNER,
				'showOrHide' : helper.EVENT_HIDE,
				'message' : ''
			}
		);
	},
	
	showError : function(component, event, helper, error) {
		helper.fireLayoutUpdateEvent(
			component, 
			event, 
			helper, 
			{
				'eventType' : helper.EVENT_TYPE_ERROR,
				'showOrHide' : helper.EVENT_SHOW,
				'message' : 'There was an error retrieving the Doggy Door Activity records. Error: ' + error
			}
		);
	},
	
	showSpinner : function(component, event, helper) {
		helper.fireLayoutUpdateEvent(
			component, 
			event, 
			helper, 
			{
				'eventType' : helper.EVENT_TYPE_SPINNER,
				'showOrHide' : helper.EVENT_SHOW,
				'message' : ''
			}
		);
	},
	
})
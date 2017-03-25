({
	
	dispatchRecords : function(component, event, helper, records) {
		var dispatchEvent = $A.get('e.c:DDA_DataDispatcherEvent');
		
		dispatchEvent.setParams({
			'records' : records
		});
		
		dispatchEvent.fire();
	},
	
	getRecords : function(component, event, helper, fromTimeStamp, toTimeStamp) {
		var spinner = component.find('spinner');
		var notification = component.find('notification');
		var action = component.get('c.getActivitiesByDateRange');
		
		$A.util.removeClass(spinner, 'slds-hide');
		$A.util.addClass(notification, 'slds-hide');
		
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
				component.set('v.error', response.getError());
				$A.util.removeClass(notification, 'slds-hide');
			}
			console.log('response', response);
			
			$A.util.addClass(spinner, 'slds-hide');
			
		});
		
		$A.enqueueAction(action);
	},
	
	handleDateRangeUpdateEvent : function(component, event, helper) {
		var fromTimeStamp = event.getParam('fromTimeStamp');
		var toTimeStamp = event.getParam('toTimeStamp');
		
		helper.getRecords(component, event, helper, fromTimeStamp, toTimeStamp);
	},
	
})
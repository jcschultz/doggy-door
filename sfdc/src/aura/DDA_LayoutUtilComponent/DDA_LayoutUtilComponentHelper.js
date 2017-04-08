({
	
	EVENT_TYPE_SPINNER : 'SPINNER',
	EVENT_TYPE_ERROR : 'ERROR',
	EVENT_SHOW : 'SHOW',
	EVENT_HIDE : 'HIDE',
	
	handleLayoutUpdateRequest : function(component, event, helper) {
		var eventType = event.getParam('eventType');
		var show = (event.getParam('showOrHide') === helper.EVENT_SHOW);
		var message = event.getParam('message');
		
		if (eventType === helper.EVENT_TYPE_SPINNER) {
			component.set('v.showSpinner', show);
		}
		else if (eventType === helper.EVENT_TYPE_ERROR) {
			component.set('v.error', message);
			component.set('v.showError', show);
		}
	}
	
})
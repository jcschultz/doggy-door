({
	
	handleDataDispatch : function(component, event, helper) {
		var records = event.getParam('records');
		var totalCount = component.find('totalCount');
		totalCount.set('v.value', 'Total trips through the door: ' + records.length);
	},
	
})
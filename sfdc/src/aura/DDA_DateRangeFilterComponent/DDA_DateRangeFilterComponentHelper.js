({
	setInitialDates : function(component, event, helper) {
		var fromDate = moment().startOf('week').format('YYYY-MM-DD');
		var toDate = moment().endOf('week').format('YYYY-MM-DD');
		
		component.find('fromDate').set('v.value', fromDate);
		component.find('toDate').set('v.value', toDate);
		
		helper.updateDateRange(component, event, helper);
	},
	
	updateDateRange : function(component, event, helper) {
		var fromDate,
			toDate,
			momentFrom,
			momentTo,
			paramFrom,
			paramTo,
			dateChangeEvent;
			
		fromDate = component.find('fromDate').get('v.value');
		toDate = component.find('toDate').get('v.value');
		
		if (!fromDate || !toDate) {
			return;
		}
		
		momentFrom = moment(fromDate);
		momentTo = moment(toDate);
		
		if (!momentFrom.isValid() || !momentTo.isValid()) {
			return;
		}
		
		if (momentFrom.isSameOrBefore(momentTo)) {
			paramFrom = momentFrom.valueOf();
			paramTo = momentTo.endOf('day').valueOf();
		}
		else if (momentFrom.isAfter(momentTo)) {
			paramFrom = momentTo.valueOf();
			paramTo = momentFrom.endOf('day').valueOf();
		}
		else {
			return;
		}
		
		dateChangeEvent = $A.get('e.c:DDA_DateRangeUpdateEvent');
		dateChangeEvent.setParams({
			'fromTimeStamp' : paramFrom,
			'toTimeStamp' : paramTo
		});
		dateChangeEvent.fire();
	},
	
})

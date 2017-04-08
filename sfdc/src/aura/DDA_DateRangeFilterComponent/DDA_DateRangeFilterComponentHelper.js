({
	
	RANGES : {
		TODAY : 'day',
		WEEK : 'week',
		MONTH : 'month',
		CUSTOM : 'week'
	},
	
	handleDateButtonClick : function(component, event, helper) {
		var dateRange = event.target.dataset.choice;
		component.set('v.buttonChoice', dateRange);
		
		if (dateRange != 'CUSTOM') {
			helper.setDates(component, event, helper);
		}
	},
	
	setDates : function(component, event, helper) {
		var dateRange = component.get('v.buttonChoice');
		var rangeType = helper.RANGES[dateRange];
		var fromDate = moment().startOf(rangeType).format('YYYY-MM-DD');
		var toDate = moment().endOf(rangeType).format('YYYY-MM-DD');
		
		component.set('v.fromDate', fromDate);
		component.set('v.toDate', toDate);
		
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
			
		fromDate = component.get('v.fromDate');
		toDate = component.get('v.toDate');
		
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
({
	
	DAYS : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	EVENT_TYPE_ERROR : 'ERROR',
	EVENT_SHOW : 'SHOW',
	
	handleScriptsLoaded : function(component, event, helper) {
		var action = component.get('c.getActivitiesByDateRange');
		var endOfToday = moment().endOf('day').valueOf();
		var startOfMonth = moment().subtract(30, 'days').startOf('day').valueOf();
		
		action.setParams({
			'fromTimeStamp' : startOfMonth,
			'toTimeStamp' : endOfToday
		});
		
		action.setCallback(this, function(res){
			var returnValue = res.getReturnValue();
			var state = res.getState();
			
			if (state === 'SUCCESS') {
				helper.parseResults(helper, returnValue);
			}
			else {
				helper.showError(component, event, helper, res.getError());
			}
			// console.log('recentDataDispatcher callback', returnValue);
		});
		
		$A.enqueueAction(action);
	},
	
	parseResults : function(helper, records) {
		var todayStart = moment().startOf('day').valueOf();
		var todayEnd = moment().endOf('day').valueOf();
		var weekStart = moment().subtract(6, 'days').startOf('day').valueOf();
		var monthStart = moment().subtract(29, 'days').startOf('day').valueOf();
		var dispatcherEvent = $A.get('e.c:DDA_RecentDataDispatcherEvent');
		var todayHours = [];
		var weekDays = [];
		var monthDates = {};
		var monthTimestamps = [];
		var eventParams = {
			'todayCount' : 0,
			'todayHighlightLabel' : 'Busiest Hour',
			'todayHighlightValue' : '',
			'todayBusyHour' : 0,
			'todayBusyHourAmPm' : '',
			'todayBusyHourCount' : 0,
			'weekCount' : 0,
			'weekHighlightLabel' : 'Busiest Day',
			'weekHighlightValue' : '',
			'weekDayCount' : [],
			'weekDayLabels' : [],
			'weekDayBusiestCount' : 0,
			'monthCount' : 0,
			'monthHighlightLabel' : 'Busiest Date',
			'monthHighlightValue' : '',
			'monthDayCount' : [],
			'monthDayBusiestCount' : 0
		};
		var highHourIndex = 0;
		var highHourValue = 0;
		var highDayIndex = 0;
		var highDayValue = 0;
		var highDateTimestamp = 0;
		var highDateValue = 0;
		
		for (var i = 0; i < 30; i++) {
			if (i < 7) {
				weekDays[i] = 0;
			}
			if (i < 24) {
				todayHours[i] = 0;
			}
			
			var monthTimestamp = moment().subtract(30, 'days').startOf('day').add(i, 'days').startOf('day').valueOf();
			monthDates[monthTimestamp] = 0;
			monthTimestamps[i] = monthTimestamp;
		}
		
		
		if (records && records.length) {
			for (var i = 0; i < records.length; i++) {
				if (records[i]) {
					// if record is from today, aggregate the hour
					if (records[i].Timestamp__c >= todayStart && records[i].Timestamp__c <= todayEnd) {
						eventParams.todayCount++;
						todayHours[records[i].Hour__c]++;
					}
					
					// if record is from the last 7 days, aggregate the day of week
					if (records[i].Timestamp__c >= weekStart && records[i].Timestamp__c <= todayEnd) {
						eventParams.weekCount++;
						var idx = helper.DAYS.indexOf(records[i].Day__c);
						if (idx > -1) {
							weekDays[idx]++;
						}
					}
					
					// if record is from the last 30 days, aggregate the date
					if (records[i].Timestamp__c >= monthStart && records[i].Timestamp__c <= todayEnd) {
						eventParams.monthCount++;
						monthDates[moment(records[i].Timestamp__c).startOf('day').valueOf()]++;
					}
				}
			}
			
			// loop through results to find the highest values.
			// get busiest hour of today and figure out 12 hour conversion
			for (var i = 0; i < todayHours.length; i++) {
				if (todayHours[i] > highHourValue) {
					highHourValue = todayHours[i];
					highHourIndex = i;
				}
			}
			eventParams.todayHighlightValue = highHourIndex;
			eventParams.todayBusyHourCount = highHourValue;
			if (highHourIndex === 0) {
				eventParams.todayHighlightValue = '12am';
				eventParams.todayBusyHour = 12;
				eventParams.todayBusyHourAmPm = 'am';
			}
			if (highHourIndex > 0 && highHourIndex < 12) {
				eventParams.todayHighlightValue += 'am';
				eventParams.todayBusyHour = highHourIndex;
				eventParams.todayBusyHourAmPm = 'am';
			}
			if (highHourIndex > 12) {
				eventParams.todayHighlightValue = eventParams.todayHighlightValue - 12;
				eventParams.todayBusyHour = eventParams.todayHighlightValue;
			} 
			if (highHourIndex > 11) {
				eventParams.todayHighlightValue += 'pm';
				eventParams.todayBusyHourAmPm = 'pm';
			}
			
			// get busiest day of the last 7 days
			for (var i = 0; i < weekDays.length; i++) {
				if (weekDays[i] > highDayValue) {
					highDayValue = weekDays[i];
					highDayIndex = i;
				}
			}
			eventParams.weekDayCount = weekDays;
			eventParams.weekDayLabels = helper.DAYS;
			eventParams.weekHighlightValue = helper.DAYS[highDayIndex];
			eventParams.weekDayBusiestCount = highDayValue;
			
			// get busiest day of the last 30 days
			for (var i = 0; i < monthTimestamps.length; i++) {
				if (monthDates[monthTimestamps[i]] > highDateValue) {
					highDateValue = monthDates[monthTimestamps[i]];
					highDateTimestamp = monthTimestamps[i];
				}
				eventParams.monthDayCount[i] = monthDates[monthTimestamps[i]];
			}
			eventParams.monthHighlightValue = moment(highDateTimestamp).format('ddd MMM Do');
			eventParams.monthDayBusiestCount = highDateValue;
			
			dispatcherEvent.setParams(eventParams);
			dispatcherEvent.fire();
		}
	},
	
	showError : function(component, event, helper, error) {
		var layoutUpdateRequestEvent = $A.get('e.c:DDA_LayoutUpdateRequestEvent');

		layoutUpdateRequestEvent.setParams({
			'eventType' : helper.EVENT_TYPE_ERROR,
			'showOrHide' : helper.EVENT_SHOW,
			'message' : 'There was an error retrieving the recent Doggy Door Activity records. Error: ' + error
		});

		layoutUpdateRequestEvent.fire();
	},
})
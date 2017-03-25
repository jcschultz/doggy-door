({
	CHARTTYPE_DAILY : 'Daily',
	CHARTTYPE_HOURLY : 'Hourly',
	DAYS : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	TITLE_DAILY : 'Trips Grouped by Day',
	TITLE_HOURLY : 'Trips Grouped by Hour',
	
	buildChart : function(component, event, helper, records) {
		var chartContainer = component.find('chartContainer');
		var chartData,
			options,
			style,
			width,
			height;
		
		if (component.get('v.chartType') === helper.CHARTTYPE_DAILY) {
			chartData = helper.buildDailyChartData(helper, records);
		}
		else if (component.get('v.chartType') === helper.CHARTTYPE_HOURLY) {
			chartData = helper.buildHourlyChartData(records);
		}
		else {
			return;
		}
		
		options = {
			tooltips: {
				enabled: true
			},
			responsive: true,
			legend: {
				display: false
			},
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero : true
					}
				}]
			}
		};
		
		$A.createComponent(
			'c:DDA_ChartJSComponent',
			{
				'chartType' : 'bar',
				'data' : chartData,
				'options' : options
			},
			function(chartComp, status, errorMessage) {
				if (status === 'SUCCESS') {
					var body = [];
					body.push(chartComp);
					chartContainer.set('v.body', body);
				}
				else if (status === 'INCOMPLETE') {
					console.log('no response from the server or client is offline');
				}
				else if (status === 'ERROR') {
					console.log('Error: ' + errorMessage);
				}
			}
		);
	},
	
	buildDailyChartData : function(helper, records) {
		var counts,
			chartData;
		
		counts = [0,0,0,0,0,0,0];
		
		if (records && records.length) {
			for (var i = 0; i < records.length; i++) {
				if (records[i]) {
					var idx = helper.DAYS.indexOf(records[i].Day__c);
					
					if (idx > -1) {
						counts[idx]++;
					}
				}
			}
		}
		
		chartData = {
			labels: helper.DAYS,
			datasets: [
				{
					data: counts,
					backgroundColor : '#2574a9',
					borderColor : '#1c577f'
				}
			]
		};
		
		return chartData;
	},
	
	buildHourlyChartData : function(records) {
		var counts,
			hours,
			chartData;
			
		counts = [];
		hours = [];
			
		for (var i = 0; i < 24; i++) {
			counts[i] = 0;
		}
		
		for (var i = 0; i < 2; i++) {
			var ampm = i < 1 ? 'am' : 'pm';
			
			for (var j = 0; j < 12; j++) {
				var h = j === 0 ? 12 : j;
				
				hours.push(h + ampm);
			}
		}
		
		if (records && records.length) {
			for (var i = 0; i < records.length; i++) {
				if (records[i]) {
					counts[records[i].Hour__c]++
				}
			}
		}
		
		chartData = {
			labels: hours,
			datasets: [
				{
					data: counts,
					backgroundColor : '#2574a9',
					borderColor : '#1c577f'
				}
			]
		};
		
		return chartData;
	},
	
	doInit : function(component, event, helper) {
		helper.setTitle(component, event, helper);
		helper.buildChart(component, event, helper, []);
	},
	
	handleDataDispatch : function(component, event, helper) {
		helper.buildChart(component, event, helper, event.getParam('records'));
	},
	
	setTitle : function(component, event, helper) {
		var title;
		
		if (component.get('v.chartType') === helper.CHARTTYPE_DAILY) {
			title = helper.TITLE_DAILY;
		}
		else if (component.get('v.chartType') === helper.CHARTTYPE_HOURLY) {
			title = helper.TITLE_HOURLY;
		}
		
		component.set('v.title', title);
	},
	
	
})
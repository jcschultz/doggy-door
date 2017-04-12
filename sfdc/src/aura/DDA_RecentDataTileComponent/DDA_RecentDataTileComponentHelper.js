({
	
	TODAY : 'Today',
	WEEK : '7 Day',
	MONTH : '30 Day',
	TITLE_TODAY : 'Today&rsquo;s Trips',
	TITLE_WEEK : 'Last 7 Days&rsquo; Trips',
	TITLE_MONTH : 'Last 30 Days&rsquo; Trips',
	CHART_TYPE_RADAR : 'radar',
	CHART_TYPE_PIE : 'pie',
	CHART_TYPE_LINE : 'line',
	
	doInit : function(component, event, helper) {
		var tileType = component.get('v.chartType');
		
		// set up chart defaults
		var options = {
			tooltips: {
				enabled: false
			},
			responsive: true,
			maintainAspectRatio: false,
			legend: {
				display: false
			}
		};
		
		// set up title and chart type
		switch(tileType) {
			case helper.TODAY:
				component.set('v.title', helper.TITLE_TODAY);
				component.set('v.jsChartType', helper.CHART_TYPE_PIE);
				break;
			case helper.WEEK:
				component.set('v.title', helper.TITLE_WEEK);
				component.set('v.jsChartType', helper.CHART_TYPE_RADAR);
				break;
			case helper.MONTH:
				component.set('v.title', helper.TITLE_MONTH);
				component.set('v.jsChartType', helper.CHART_TYPE_LINE);
				break;
		}
		
		component.set('v.isToday', tileType === helper.TODAY);
		component.set('v.isWeek', tileType === helper.WEEK);
		component.set('v.isMonth', tileType === helper.MONTH);
		component.set('v.jsChartOptions', options);
	},
	
	flipTile : function(component, event, helper) {
		var tile = component.find('outerTileContainer');
		$A.util.addClass(tile, 'closed');
		
		window.setTimeout(
			$A.getCallback(function(){
				helper.flipTilePartTwo(component, event, helper);
			}), 
			200
		);
	},
	
	flipTilePartTwo : function(component, event, helper) {
		var isShowingFront = component.get('v.showFront');
		var tile = component.find('outerTileContainer');
		
		component.set('v.showFront', !isShowingFront);
		component.set('v.showChart', false);
		
		$A.util.removeClass(tile, 'closed');
		
		window.setTimeout(
			$A.getCallback(function(){
				helper.flipTilePartThree(component, event, helper);
			}), 
			200
		);
	},
	
	flipTilePartThree : function(component, event, helper) {
		var isShowingFront = component.get('v.showFront');
		
		if (!isShowingFront) {
			component.set('v.showChart', true);
		}
	},
	
	handleDataDispatch : function(component, event, helper) {
		var chartData = {
			labels: [],
			datasets: [
				{
					data: []
				}
			]
		};
		
		
		if (component.get('v.isToday')) {
			component.set('v.count', event.getParam('todayCount'));
			component.set('v.titleBack', event.getParam('todayHighlightLabel'));
			component.set('v.tileBackInfo', 'Busiest at ' + event.getParam('todayHighlightValue') + ' with ' + event.getParam('todayBusyHourCount'));
			
			var todayBusyHour = event.getParam('todayBusyHour');
			chartData.datasets[0].data.push(todayBusyHour);
			chartData.datasets[0].data.push(12 - todayBusyHour);
			chartData.datasets[0].backgroundColor = ['#2574a9', '#fff'];
			chartData.datasets[0].borderColor = '#2574a9';
			component.set('v.jsChartData', chartData);
		}
		else if (component.get('v.isWeek')) {
			component.set('v.count', event.getParam('weekCount'));
			component.set('v.titleBack', event.getParam('weekHighlightLabel'));
			component.set('v.tileBackInfo', 'Busiest on ' + event.getParam('weekHighlightValue') + ' with ' + event.getParam('weekDayBusiestCount'));
			
			var labels = event.getParam('weekDayLabels');
			var data = event.getParam('weekDayCount');
			
			for (var i = 0; i < labels.length; i++) {
				chartData.labels.push(labels[i]);
			}
			for (var i = 0; i < data.length; i++) {
				chartData.datasets[0].data.push(data[i]);
			}
			chartData.datasets[0].backgroundColor = 'rgba(0, 57, 107, 0.2)';
			chartData.datasets[0].borderColor = 'rgba(0, 57, 107, 1)';
			component.set('v.jsChartData', chartData);
		}
		else if (component.get('v.isMonth')) {
			component.set('v.count', event.getParam('monthCount'));
			component.set('v.titleBack', event.getParam('monthHighlightLabel'));
			component.set('v.tileBackInfo', 'Busiest on ' + event.getParam('monthHighlightValue') + ' with ' + event.getParam('monthDayBusiestCount'));
			
			var data = event.getParam('monthDayCount');
			
			for (var i = 0; i < data.length; i++) {
				chartData.datasets[0].data.push(data[i]);
				chartData.labels.push('');
			}
			chartData.datasets[0].backgroundColor = 'rgba(0, 57, 107, 0.2)';
			chartData.datasets[0].borderColor = 'rgba(0, 57, 107, 1)';
			chartData.datasets[0].pointRadius = 0;
			component.set('v.jsChartData', chartData);
		}
	}
})
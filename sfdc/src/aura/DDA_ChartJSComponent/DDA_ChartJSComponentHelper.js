({
	buildChart : function(component, event, helper) {
		var chartType = component.get('v.chartType');
		var data = component.get('v.data');
		var options = component.get('v.options');
		var width = component.get('v.width');
		var height = component.get('v.height');
		var style = component.get('v.style');
		var chartCanvas = component.find('chartCanvas').getElement();
		
		if (width) {
			chartCanvas.setAttribute('width', width);
		}
		if (height) {
			chartCanvas.setAttribute('height', height);
		}
		if (style) {
			chartCanvas.setAttribute('style', style);
		}
		
		if (chartType && data) {
			var chartObj = new Chart(chartCanvas, {
				type: chartType,
				data: data,
				options: options
			});
		}
	},
})
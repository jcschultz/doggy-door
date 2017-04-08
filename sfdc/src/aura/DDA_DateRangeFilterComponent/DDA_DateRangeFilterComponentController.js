({
	handleFilterButtonPress : function(component, event, helper) {
		helper.updateDateRange(component, event, helper);
	},
	
	handleDateButtonClick : function(component, event, helper) {
		helper.handleDateButtonClick(component, event, helper);
	},
	
	handleScriptsLoaded : function(component, event, helper) {
		helper.setDates(component, event, helper);
	},
})
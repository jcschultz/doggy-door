({
	handleFilterButtonPress : function(component, event, helper) {
		helper.updateDateRange(component, event, helper);
	},
	
	handleScriptsLoaded : function(component, event, helper) {
		helper.setInitialDates(component, event, helper);
	},
})
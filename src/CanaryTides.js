window.CanaryTides = window.CanaryTides || {};

(function(CanaryTides, undefined) {
	
	function AppNavigator() {
		this.widgets = {};

		this.attachSearchButton = function(searchButton){
			this.widgets["searchButton"] = searchButton;
		};

		this.attachDateSelector = function(dateSelector){
			this.widgets["dateSelector"] = dateSelector;
		};

		this.attachLocationSelector = function(locationSelector){
			this.widgets["locationSelector"] = locationSelector;
		};

	}
	
	AppNavigator.prototype.constructor = AppNavigator;

	/******* Factory *******/
	var createAppNavigator = function(){
		return new AppNavigator();
	};
	
	CanaryTides.Factory = CanaryTides.Factory || { };
	CanaryTides.Factory.AppNavigator = createAppNavigator;

}(window.CanaryTides));
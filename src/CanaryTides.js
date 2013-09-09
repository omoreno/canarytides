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
	}
	
	AppNavigator.prototype.constructor = AppNavigator;

	/******* Factory *******/
	var createAppNavigator = function(){
		return new AppNavigator();
	};
	
	CanaryTides.Factory = CanaryTides.Factory || { };
	CanaryTides.Factory.AppNavigator = createAppNavigator;
}(window.CanaryTides));
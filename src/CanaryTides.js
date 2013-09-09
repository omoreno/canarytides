window.CanaryTides = window.CanaryTides || {};

(function(CanaryTides, undefined) {
	
	/******* Widgets *******/
	function TextBoxWidget(elementId){
		var self = this;
		this.elementId = elementId;

		var createDomElement = function () {
			var element = $('<input>', { type: "text", id: self.elementId });
			$("body").append(element);
		};

		this.initialize = function(){
			createDomElement();
		};

	};

	function ButtonWidget(elementId){
		var self = this;
		this.elementId = elementId;

		var createDomElement = function () {
			var element = $('<button>', { id: self.elementId });
			$("body").append(element);
		};

		this.initialize = function(){
			createDomElement();
		};

	};
	
	CanaryTides.Widgets = CanaryTides.Widgets || {};
	CanaryTides.Widgets.TextBox = TextBoxWidget;
	CanaryTides.Widgets.Button = ButtonWidget;

	/******* Main App Navigator *******/
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
window.CanaryTides = window.CanaryTides || {};

(function(CanaryTides, undefined) {
	
	/******* Widgets *******/
	function Widget(elementId){
		this.elementId= elementId;

		var attachToDOM = function(element){
			$("body").append(element);
		};
		
		this.initialize = function(){
			var element = this.createElement();
			attachToDOM(element);
		};

		this.createElement = function(){};//to be overrided
	};

	function TextBoxWidget(elementId){
		Widget.call(this, elementId);
		
		this.createElement = function () {
			return $('<input>', { type: "text", id: this.elementId });
		};
	};
	TextBoxWidget.prototype = new Widget();
	TextBoxWidget.prototype.constructor = TextBoxWidget;

	function ButtonWidget(elementId){
		Widget.call(this, elementId);
		
		this.createElement = function () {
			return $('<button>', { id: this.elementId });
		};
	};
	ButtonWidget.prototype = new Widget();
	ButtonWidget.prototype.constructor = ButtonWidget;

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
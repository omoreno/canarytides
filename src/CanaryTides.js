window.CanaryTides = window.CanaryTides || {};

(function(CanaryTides, undefined) {
	
	/******* Widgets *******/
	function Widget(elementId){
		this._nativeWidget;
		this.elementId = elementId;

		var attachToDOM = function(element){
			$("body").append(element);
		};
		
		this.initialize = function(){
			this._nativeWidget = $("#" + this.elementId);
			if (this._nativeWidget.length == 0){
				this._nativeWidget = this.createElement();
				attachToDOM(this._nativeWidget);
			}
			this.subscribeEvents();
		};

		this.nativeWidget = function(){
			return $("#" + this.elementId);
		};

		this.createElement = function(){}; //to be overrided
		this.subscribeEvents = function(){}; //to be overrided
	};

	function TextBoxWidget(elementId){
		Widget.call(this, elementId);
		
		this.createElement = function () {
			return $('<input>', { type: "text", id: this.elementId });
		};
	};
	TextBoxWidget.prototype = new Widget();
	TextBoxWidget.prototype.constructor = TextBoxWidget;

	function ButtonWidget(elementId, caption){
		Widget.call(this, elementId);
		var self = this;
		this.createElement = function () {
			return $('<button>', { id: this.elementId, text: caption });
		};

		this.subscribeEvents = function(){
			this._nativeWidget.click(function(e){
				self.onClick();
				e.preventDefault();
			});
		};

		this.onClick = function(){}; //to be handled
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
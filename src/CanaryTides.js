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

	function DatePickerWidget(elementId){
		Widget.call(this, elementId);
		var self = this;
		this.createElement = function () {
			return $('<input>', { id: this.elementId }).datepicker();
		};

		this.setDate = function(date){
			this._nativeWidget.text(date);
		};

		this.selectedDate = function(){
			return this._nativeWidget.text();
		};
	};
	DatePickerWidget.prototype = new Widget();
	DatePickerWidget.prototype.constructor = DatePickerWidget;

	function SingleChoiceSelectableWidget(elementId){
		Widget.call(this, elementId);
		var self = this;
		this.createElement = function () {
			return $('<select>', { id: this.elementId });
		};

		this.addOptions = function(options){
			for (var i = 0, len = options.length; i < len; i++){
				var option = $("<option>");
				option.val(options[i].value).text(options[i].text);
				option.appendTo($(this._nativeWidget));
			}
		};

		this.selectOptionByValue = function(value){
			this._nativeWidget.val(value);
		};

		this.selectedOption = function(){
			return this._nativeWidget.find('option:selected')[0];
		};
	};
	SingleChoiceSelectableWidget.prototype = new Widget();
	SingleChoiceSelectableWidget.prototype.constructor = SingleChoiceSelectableWidget;

	CanaryTides.Widgets = CanaryTides.Widgets || {};
	CanaryTides.Widgets.TextBox = TextBoxWidget;
	CanaryTides.Widgets.Button = ButtonWidget;
	CanaryTides.Widgets.DatePicker = DatePickerWidget;
	CanaryTides.Widgets.SingleChoiceSelectable = SingleChoiceSelectableWidget;
	
	/******* Service *******/
	function TidesFinder(){

		this.repository = {
			getAll: function(){

			}
		};

		this.find = function(criteria){
			return this.repository
						.getAll()[criteria.location.id][criteria.date];
		};
	};

	CanaryTides.Services = CanaryTides.Services || { };
	CanaryTides.Services.TidesFinder = TidesFinder;

	/******* Main App Navigator *******/
	function AppNavigator() {
		this.widgets = {};
		var self = this;

		this.attachSearchButton = function(searchButton){
			this.widgets["searchButton"] = searchButton;
		};

		this.attachDateSelector = function(dateSelector){
			this.widgets["dateSelector"] = dateSelector;
		};

		this.attachLocationSelector = function(locationSelector){
			this.widgets["locationSelector"] = locationSelector;
		};

		this.initialize = function(){
			this.widgets.locationSelector.initialize();
			this.widgets.dateSelector.initialize();
			this.widgets.searchButton.initialize();

			this.widgets.searchButton.onClick = function(){
				var criteria = {
					date: self.widgets.dateSelector.selectedDate(),
					location: self.widgets.locationSelector.selectedOption()
				};
				self.tidesFinder.find(criteria);
			};
		};
	}
	
	AppNavigator.prototype.constructor = AppNavigator;

	/******* Factory *******/
	var islands = [{value: 1, text: "Tenerife"}];
	var createLocationSelectable = function(){
		var selectable = new CanaryTides.Widgets.SingleChoiceSelectable("locationSelector");
		selectable.addOptions(islands);
		return selectable;
	};

	var createAppNavigator = function(){
		var navigator = new AppNavigator();
		navigator.attachLocationSelector(createLocationSelectable());
		navigator.attachSearchButton(new CanaryTides.Widgets.Button("searchButton", "Search"));
		navigator.attachDateSelector(new CanaryTides.Widgets.DatePicker("dateSelector"));
		navigator.tidesFinder = new CanaryTides.Services.TidesFinder();
		return navigator;
	};
	
	CanaryTides.Factory = CanaryTides.Factory || { };
	CanaryTides.Factory.AppNavigator = createAppNavigator;

}(window.CanaryTides));
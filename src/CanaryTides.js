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
			this.postInitialize();
		};

		this.nativeWidget = function(){
			return $("#" + this.elementId);
		};

		this.createElement = function(){}; //to be overrided
		this.subscribeEvents = function(){}; //to be overrided
		this.postInitialize = function(){}; //to be overrided
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

	function TableWidget(config){
		var self = this;
		this.elementId = config.elementId;
		this.headerTexts = config.headerTexts;
		this.sourceFields = config.sourceFields;
		Widget.call(this, this.elementId);
		
		this.createElement = function () {
			return $('<table>', { id: this.elementId });
		};

		var drawHeader = function(){
			var header = "";
			for (var i = 0, len = self.headerTexts.length; i < len; i++){
				header += "<th>" + self.headerTexts[i] + "</th>";
			}
			self._nativeWidget.append(header);
		};

		var clear = function(){
			self._nativeWidget.empty();
		};

		this.bind = function(items){
			clear();
			drawHeader();
			for (var i = 0, itemsLength = items.length; i < itemsLength; i++){
				var row = "<tr>";
				for (var j = 0, fieldsLength = this.sourceFields.length; j < fieldsLength; j++){
					row += "<td>" + items[i][this.sourceFields[j]] + "</td>";
				}
				row += "</tr>";
   				this._nativeWidget.append(row);
			}
		};
	};
	TableWidget.prototype = new Widget();
	TableWidget.prototype.constructor = TableWidget;

	CanaryTides.Widgets = CanaryTides.Widgets || {};
	CanaryTides.Widgets.TextBox = TextBoxWidget;
	CanaryTides.Widgets.Button = ButtonWidget;
	CanaryTides.Widgets.DatePicker = DatePickerWidget;
	CanaryTides.Widgets.SingleChoiceSelectable = SingleChoiceSelectableWidget;
	CanaryTides.Widgets.Table = TableWidget;

	
	function QueryableObject(query){
		var _query = query;

		this.filterByLocation = function(locationId){
			_query = _query[locationId];
			return this;
		};

		this.filterByDate = function(date){
			_query = _query[date];
			return this;
		};

		this.toArray = function(){
			return _query;
		};
	};

	/******* Repository *******/
	function TidesRepository() {
		this.getAll = function(){
		}
	};

	/******* Service *******/
	function TidesFinder(tidesRepository){
		this.repository = tidesRepository;

		this.find = function(criteria){
			return new QueryableObject(this.repository.getAll())
						.filterByLocation(criteria.location.value)
						.filterByDate(criteria.date)
						.toArray();
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
			this.widgets.locationSelector.addOptions(this.locations);
		};
	}
	
	AppNavigator.prototype.constructor = AppNavigator;

	/******* Factory *******/
	var createLocationSelectable = function(){
		var selectable = new CanaryTides.Widgets.SingleChoiceSelectable("locationSelector");
		return selectable;
	};

	var createAppNavigator = function(){
		var navigator = new AppNavigator();
		navigator.locations = [
			{value: "la-palma", text: "La Palma"},
			{value: "tenerife", text: "Tenerife"},
			{value: "gran-canaria", text: "Gran Canaria"},
			{value: "lanzarote", text: "Lanzarote"}
		];
		navigator.attachLocationSelector(createLocationSelectable());
		navigator.attachSearchButton(new CanaryTides.Widgets.Button("searchButton", "Search"));
		navigator.attachDateSelector(new CanaryTides.Widgets.DatePicker("dateSelector"));
		navigator.tidesFinder = createTidesFinder();
		return navigator;
	};

	var createTidesFinder = function(){
		return new CanaryTides.Services.TidesFinder(new TidesRepository());
	};
	
	CanaryTides.Factory = CanaryTides.Factory || { };
	CanaryTides.Factory.AppNavigator = createAppNavigator;
	CanaryTides.Factory.TidesFinder = createTidesFinder;

}(window.CanaryTides));
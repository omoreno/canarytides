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

		this.hide = function() {
			this._nativeWidget.hide();
		};

		this.show = function() {
			this._nativeWidget.show();
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

	function DatePickerWidget(config){
		Widget.call(this, config.elementId);
		var config = config;
		var self = this;
		var now = new Date();
		var today = now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear();
		var defaultDate = config.defaultDate || today;
		var dateFormat = config.dateFormat || 'dd/mm/yyyy';
		var weekStart = config.weekStart || 1;

		this.createElement = function () {
			return $('<input>', { id: this.elementId });
		};

		this.postInitialize = function(){
			this._nativeWidget.pickadate({
					formatSubmit: dateFormat,
					firstDay: weekStart
			});
			this._nativeWidget.pickadate('picker').set('select', defaultDate, { format: dateFormat });
		};

		this.subscribeEvents = function(){
			this._nativeWidget.focus(function(e){
				self.onFocus();
				e.preventDefault();
			});
		};

		this.setDate = function(date){
			this._nativeWidget.pickadate('picker').set('select', date, { format: dateFormat });
		};

		this.selectedDate = function(){
			return this._nativeWidget.pickadate('picker').get('select', dateFormat);
		};

		this.onFocus = function(){}; //to be handled
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

		this.subscribeEvents = function(){
			this._nativeWidget.focus(function(e){
				self.onFocus();
				e.preventDefault();
			});
		};

		this.selectOptionByValue = function(value){
			this._nativeWidget.val(value);
		};

		this.selectedOption = function(){
			return this._nativeWidget.find('option:selected')[0];
		};

		this.onFocus = function(){}; //to be handled
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
			var header = "<thead>";
			for (var i = 0, len = self.headerTexts.length; i < len; i++){
				header += "<th>" + self.headerTexts[i] + "</th>";
			}
			header += "</thead>";
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

	function LabelWidget(elementId){
		Widget.call(this, elementId);
		
		this.createElement = function () {
			return $('<span>', { id: this.elementId });
		};

		this.showMessage = function(message) {
			this.show();
			this._nativeWidget.text(message);
		};
	};
	LabelWidget.prototype = new Widget();
	LabelWidget.prototype.constructor = LabelWidget;

	CanaryTides.Widgets = CanaryTides.Widgets || {};
	CanaryTides.Widgets.TextBox = TextBoxWidget;
	CanaryTides.Widgets.Button = ButtonWidget;
	CanaryTides.Widgets.DatePicker = DatePickerWidget;
	CanaryTides.Widgets.SingleChoiceSelectable = SingleChoiceSelectableWidget;
	CanaryTides.Widgets.Table = TableWidget;
	CanaryTides.Widgets.Label = LabelWidget;

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
			return _query || [];
		};
	};

	/******* Repository *******/
	function TidesRepository() {
		this.getAll = function(){
			return CanaryTides.database;
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

	/******* DTOs *******/
	function TideDTO(tide) {
		var humanReadableType = function(type){
			if (type == 'high')
				return CanaryTides.i18n._("Pleamar");
			return CanaryTides.i18n._("Bajamar");
		};

		this.time = tide.time;
		this.type = humanReadableType(tide.type);
		this.heightInCentimeters = tide.heightInCentimeters;
	};

	function DTOConverter(){
		this.convert = function(tides){
			var tidesDTOs = [];
			for (var i = 0, len = tides.length; i < len; i++)
				tidesDTOs.push(new TideDTO(tides[i]));
			return tidesDTOs;
		};
	};

	var i18n = {
		_: function(str){
			return str;
		}
	};
	CanaryTides.i18n = i18n;

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

		this.attachResultsWidget = function(resultsWidget){
			this.widgets["results"] = resultsWidget;
		};

		this.attachMessageWidget = function(labelWidget){
			this.widgets["message"] = labelWidget;
		};

		this.initialize = function(){
			this.widgets.locationSelector.initialize();
			this.widgets.dateSelector.initialize();
			this.widgets.searchButton.initialize();
			this.widgets.results.initialize();
			this.widgets.message.initialize();

			this.widgets.searchButton.onClick = function(){
				self.widgets.results.hide();
				self.widgets.message.hide();
				var criteria = {
					date: self.widgets.dateSelector.selectedDate(),
					location: self.widgets.locationSelector.selectedOption()
				};
				var tides = self.tidesFinder.find(criteria);
				var dtos = self.DTOConverter.convert(tides);
				if (dtos && dtos.length > 0) {
					self.widgets.results.show();
					self.widgets.results.bind(dtos);
				} else {
					self.widgets.message.showMessage(CanaryTides.i18n._("No se han encontrado resultados."));
				}
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
		var tableConfig = {
			elementId: "results",
			headerTexts: [CanaryTides.i18n._("Hora"), CanaryTides.i18n._("Tipo"), CanaryTides.i18n._("Altura (cm)")],
			sourceFields: ["time", "type", "heightInCentimeters"]
		};
		var datePickerConfig = {
			elementId: "dateSelector",
			dateFormat: "dd/mm/yyyy"
		};
		navigator.DTOConverter = new DTOConverter();
		navigator.attachLocationSelector(createLocationSelectable());
		navigator.attachSearchButton(new CanaryTides.Widgets.Button("searchButton", "Search"));
		navigator.attachDateSelector(new CanaryTides.Widgets.DatePicker(datePickerConfig));
		navigator.attachResultsWidget(new CanaryTides.Widgets.Table(tableConfig));
		navigator.attachMessageWidget(new CanaryTides.Widgets.Label("message"));
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
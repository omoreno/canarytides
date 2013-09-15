describe("Application Navigator", function() {
  var navigator;

  beforeEach(function() {
    navigator = CanaryTides.Factory.AppNavigator();
  });

  it("attaches search button", function() {
    var button = {};

    navigator.attachSearchButton(button);
 
    expect(navigator.widgets.searchButton).toBe(button);
  });

  it("attaches date selector widget", function() {
    var dateSelector = {};

    navigator.attachDateSelector(dateSelector);
    
    expect(navigator.widgets.dateSelector).toBe(dateSelector);
  });

  it("attaches location selector widget", function() {
    var locationSelectorWidget = {};

    navigator.attachLocationSelector(locationSelectorWidget);
 
    expect(navigator.widgets.locationSelector).toBe(locationSelectorWidget);
  });

  it("intializes widgets on initialize", function(){
    spyOn(navigator.widgets.locationSelector, "initialize");
    spyOn(navigator.widgets.searchButton, "initialize");
    spyOn(navigator.widgets.dateSelector, "initialize");

    navigator.initialize();

    expect(navigator.widgets.locationSelector.initialize).toHaveBeenCalled();
    expect(navigator.widgets.searchButton.initialize).toHaveBeenCalled();
    expect(navigator.widgets.dateSelector.initialize).toHaveBeenCalled();
  });

});

describe("Widgets", function(){

  describe("base widget", function(){
    var widget;
    
    beforeEach(function() {
      widget = new CanaryTides.Widgets.TextBox("textbox");
    });

    it("does not create twice if exists", function(){ 
      widget.initialize();
      widget.initialize();
      
      var element = $("body").find("[id=textbox]");
      expect(element.length).toBe(1);
    });
  });

  describe("textbox", function(){
    var textBox;

    beforeEach(function() {
      textBox = new CanaryTides.Widgets.TextBox("textbox");
    });

    it("draws on initialize", function(){	
      
      textBox.initialize();
      
      var element = $("body").find("#textbox");
      expect(element.length).toBe(1);
    });

  });

  describe("button", function(){
    var button;

    beforeEach(function() {
      button = new CanaryTides.Widgets.Button("button");
    });

    it("draws on initialize", function(){ 
      
      button.initialize();
      
      var element = $("body").find("#button");
      expect(element.length).toBe(1);
    });

    it("sets caption on initialize", function(){ 
      button = new CanaryTides.Widgets.Button("otherButton", "TestCaption");

      button.initialize();
      
      var element = $("body").find("#otherButton");
      expect(element.length).toBe(1);
      expect(element.text()).toBe("TestCaption");
    });

    it("fires event on click", function(){ 
      spyOn(button, "onClick");
      button.initialize();

      button.nativeWidget().click();
      
      expect(button.onClick).toHaveBeenCalled();
    });
  });

  describe("datepicker", function(){
    var datePicker;

    beforeEach(function() {
      datePicker = new CanaryTides.Widgets.DatePicker("datepicker");
    });

    it("draws on initialize", function(){ 
      
      datePicker.initialize();
      
      var element = $("body").find("#datepicker");
      expect(element.length).toBe(1);
    });

    it("sets date", function(){
      datePicker.initialize();

      datePicker.setDate("02/05/2000");

      var element = $("body").find("#datepicker");
      expect(element.text()).toBe("02/05/2000");
    });

    it("gets selected date", function(){
      datePicker.initialize();

      datePicker.setDate("02/05/2000");

      var selectedDate = datePicker.selectedDate();
      expect(selectedDate).toBe("02/05/2000");
    });
  });

  describe("single choice selectable", function(){
    var singleChoiceSelectable;

    beforeEach(function() {
      singleChoiceSelectable = new CanaryTides.Widgets.SingleChoiceSelectable("selectable");
    });

    it("draws on initialize", function(){ 
      
      singleChoiceSelectable.initialize();
      
      var element = $("body").find("#selectable");
      expect(element.length).toBe(1);
    });

    it("add options", function(){ 
      singleChoiceSelectable.initialize();

      singleChoiceSelectable.addOptions(
              [{value: 1, text: "item1"}, {value: 2, text: "item2"}]);
      
      var options = $("#selectable option");
      expect(options.length).toBe(2);
      expect(options[0].value).toBe("1");
      expect(options[0].text).toBe("item1");
      expect(options[1].value).toBe("2");
      expect(options[1].text).toBe("item2");
    });

    it("get selected option", function(){ 
      singleChoiceSelectable.initialize();
      singleChoiceSelectable.addOptions(
              [{value: 1, text: "item1"}, {value: 2, text: "item2"}]);
      singleChoiceSelectable.selectOptionByValue(2);

      var selectedOption = singleChoiceSelectable.selectedOption();

      expect(selectedOption.value).toBe("2");
      expect(selectedOption.text).toBe("item2");
    });

  });
});
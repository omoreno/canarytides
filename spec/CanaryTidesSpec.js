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
  });
});
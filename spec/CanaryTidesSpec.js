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

  describe("Widgets", function(){

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
  });
});
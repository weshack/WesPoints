var page = new WebPage(), testindex = 0, loadInProgress = false;
var args = require('system').args;

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

page.onLoadStarted = function() {
  loadInProgress = true;
};

page.onLoadFinished = function() {
  loadInProgress = false;
};

var steps = [
  function() {
    //Load Login Page
    page.open("https://wesleyan-sp.blackboard.com/eAccounts/AnonymousHome.aspx?ReturnUrl=%2feAccounts%2fAccountSummary.aspx%3fmenu%3d0&menu=0");
  },
  function() {
    //Enter Credentials
    page.evaluate(function(args) {
      document.getElementById('MainContent_SignInUserName').value = args[1];
      document.getElementById('MainContent_SignInPassword').value = args[2];
      document.getElementById('MainContent_SignInButton').click();
    }, args);
  }, 
  function() {
    page.evaluate(function() {
      document.getElementById('MainContent_BoardAccountContainer1').click();
      setTimeout(function(){
        console.log(document.getElementById('MainContent_mprSemQtrValue').innerHTML);
        console.log(document.getElementsByClassName('accountBalance')[2].getElementsByTagName('span')[0].innerHTML);
        var plan = document.getElementsByClassName('accountName')[4].innerText.split(" ");
        console.log(plan[0]);
        console.log(plan[2]);
        console.log(document.getElementById('MainContent_mprGuestValue').innerHTML);
      }, 3000);
    });
  }
];

interval = setInterval(function() {
  if (!loadInProgress && typeof steps[testindex] == "function") {
    steps[testindex]();
    testindex++;
  }
  if (typeof steps[testindex] != "function") {
    setTimeout(phantom.exit, 3500);
    return;
  }
}, 50);

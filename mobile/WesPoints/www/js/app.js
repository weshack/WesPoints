// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'LocalStorageModule'])

.run(function($ionicPlatform, $rootScope, localStorageService, $http, $location, $ionicPopup, $state, $ionicLoading) {

  $rootScope.loadLogin = function () {
    if(_.isUndefined($rootScope.data)) {
      $ionicLoading.show({
        template: 'Loading...'
      });
    }
    var d = new FormData();
    var user = localStorageService.get("user");
    d.append("username", user.username);
    d.append("password", user.password);

    $http.post('http://wespoints.joomah.com/points/', d, {
      headers: { 'Content-Type': undefined },
      transformRequest: function(data) { return data; }
    }).then(function (data) {
      $rootScope.data = data.data;
      $state.go($state.current, {}, {reload: true});
      $ionicLoading.hide();
    }, function (res) {
      var alertPopup = $ionicPopup.alert({
        title: 'Request failed',
        template: 'Are you sure you entered the correct password?',
        buttons: [{text: "Go to settings"}]
      });
      alertPopup.then(function(res) {
        $location.path('/account');
      });
    });
  };

  var user = localStorageService.get("user");
  if(!_.isUndefined(user) && !_.isNull(user)) {
    $rootScope.loadLogin();
  }

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider, $httpProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/account');

  localStorageServiceProvider
    .setPrefix('wespoints');
});

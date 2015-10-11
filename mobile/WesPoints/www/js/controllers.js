angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, localStorageService) {

  $scope.$on('$ionicView.enter', function() {
    if(_.isUndefined($rootScope.data)) {
      $scope.calendar = {days: 0, weeks: 0};
      $scope.plan = {meals: 0, points: 0};
      $scope.remaining = {meals: 0, points: 0, days: 0, weeks: 0, guestMeals: 0};
    }

    $rootScope.loadLogin();

    var calendar = localStorageService.get("calendar");
    var settings = localStorageService.get("settings");

    var semester = moment.range(calendar.start, calendar.end);
    var semesterWithoutBreaks = [semester];
    var remaining = moment.range(moment(), calendar.end);
    var remainingWithoutBreaks = [remaining];

    calendar.breaks.map(function (b) {
      b.range = moment.range(b.start, b.end);
      if(_.isBoolean(settings[b.name]) && settings[b.name]) {
        b.selected = true;
      } else {
        b.selected = false;
      }
      return b;
    }).forEach(function (b) {
      if(!b.selected) {
        semesterWithoutBreaks = _.flatten(semesterWithoutBreaks.map(function (s) {
          if(!_.isUndefined(s)) {
            s = s.subtract(b.range);
          }
          return s;
        }));
        remainingWithoutBreaks = _.flatten(remainingWithoutBreaks.map(function (s) {
          if(!_.isUndefined(s)) {
            s = s.subtract(b.range);
          }
          return s;
        }));
      }
    });

    var semesterLength = semesterWithoutBreaks.reduce(function (prev, curr) {
      return _.isUndefined(curr) ? prev : prev + curr.diff('days');
    }, 0);
    var remainingDays = remainingWithoutBreaks.reduce(function (prev, curr) {
      return _.isUndefined(curr) ? prev : prev + curr.diff('days');
    }, 0);

    $scope.calendar = {days: semesterLength, weeks: semesterLength / 7};
    $scope.plan = {meals: $rootScope.data.plan_meals, points: $rootScope.data.plan_points};
    $scope.remaining = {meals: $rootScope.data.meals, points: $rootScope.data.points, days: remainingDays, weeks: remainingDays / 7, guestMeals: $rootScope.data.guest_meals};

  });
})

.controller('AccountCtrl', function($scope, $rootScope, localStorageService, $http, $state) {

  $http.get('http://wespoints.joomah.com/calendar').then(function(data) {
    $rootScope.calendar = data.data;
    localStorageService.set("calendar", $rootScope.calendar);
    $scope.breaks = localStorageService.get("calendar").breaks;
    $state.go($state.current, {}, {reload: true});
  });

  $scope.update = function () {
    localStorageService.set("settings", $rootScope.settings);
    localStorageService.set("user", $rootScope.user);
  };
  $rootScope.settings = localStorageService.get("settings");
  $rootScope.user = localStorageService.get("user");
});

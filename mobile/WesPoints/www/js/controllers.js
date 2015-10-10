angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, localStorageService) {

  $scope.$on('$ionicView.enter', function() {
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
      console.log(curr);
      return _.isUndefined(curr) ? prev : prev + curr.diff('days');
    }, 0);
    var remainingDays = remainingWithoutBreaks.reduce(function (prev, curr) {
      return _.isUndefined(curr) ? prev : prev + curr.diff('days');
    }, 0);
    console.log(semesterLength);
    console.log(remainingDays);

    $scope.calendar = {days: semesterLength, weeks: semesterLength / 7};
    $scope.plan = {meals: 105, points: 720};
    $scope.remaining = {meals: 72, points: 417.45, days: remainingDays, weeks: remainingDays / 7, guestMeals: 7};
  });
})

.controller('AccountCtrl', function($scope, $rootScope, localStorageService) {

  $scope.breaks = localStorageService.get("calendar").breaks;
  $scope.update = function () {
    localStorageService.set("settings", $rootScope);
  };
});

angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('AccountCtrl', function($scope, $rootScope) {
  $scope.breaks = $rootScope.calendar.breaks;
  console.log($rootScope.calendar);
});

'use strict';

var scheduleControllers;

scheduleControllers = angular.module('scheduleControllers', []);

scheduleControllers.controller('ScheduleDashCtrl', function($scope, $state) {
    $scope.subnavmenuitems = [
		{sref: 'schedule.calendar', name: 'Calendar'},
		{sref: 'schedule', name: 'Sub schedule 2'},
		{sref: 'schedule', name: 'Sub schedule 3'},
		{sref: 'schedule', name: 'Sub schedule 4'}
    ];
    if ($state.current.name == 'schedule') $state.go('schedule.calendar');
});
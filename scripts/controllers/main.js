'use strict';

var dashControllers;

dashControllers = angular.module('dashControllers', []);

dashControllers.controller('DashCtrl', function($scope, $state) {
    $scope.subnavmenuitems = [];
});


dashControllers.controller('InboxDashCtl', function ($scope, $state) {
    $scope.approvalPane = false;
});
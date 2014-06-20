'use strict';

var accountControllers;

accountControllers = angular.module('accountControllers', []);

accountControllers.controller('AccountDashCtrl', function($scope, $state) {
    $scope.subnavmenuitems = [
		{sref: 'account.settings', name: 'Account Settings'},
		{sref: 'account.notifications', name: 'Notifications'},
		{sref: 'account.billing', name: 'Billing'}
    ];
});
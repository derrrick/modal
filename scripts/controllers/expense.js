'use strict';

var expenseControllers;

expenseControllers = angular.module('expenseControllers', []);

expenseControllers.controller('ExpenseDashCtrl', function($scope, $state) {
    $scope.subnavmenuitems = [
		{sref: 'expense.transactions', name: 'Transactions'},
		{sref: 'expense.charts', name: 'Charts'},
		{sref: 'expense.map', name: 'Map'}
    ];
    if ($state.current.name == 'expense') $state.go('expense.transactions');
});

expenseControllers.controller('ExpenseTransactCtrl', function($scope, growl, $modal, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
    var addExpenseModal = $modal({scope: $scope, template: '/views/templates/modal.expense.add.html', show: false});

    var rExpense = Restangular.all('expense');
    $scope.expensesList = rExpense.getList().$object;

    $scope.projectsList = Restangular.one('users', $scope.ckGlobal.user.user_id).all('projects').getList().$object;

    $scope.saveNewExpense = function() {
        Restangular.all('expense').post($scope.newExpense).then(function(resp) {
            $scope.expensesList.push(resp);
            growl.success('Saved...');
        });
    };

    $scope.createNewExpense = function() {
        addExpenseModal.$promise.then(addExpenseModal.show);
    };

    $scope.closeAddNewExpense = function() {
        addExpenseModal.hide();
    };

    $scope.confirmDelete = function () {
        confirmDeleteModal.hide();
        var expense = $scope.expensesList[$scope.deleteIndex];
        Restangular.one('expense', expense.id).remove().then(function(){
            $scope.expensesList.splice($scope.deleteIndex, 1);
            growl.success('Deleted...');
        });
        $scope.deleteIndex = null;
    };

    $scope.cancelDelete = function () {
        confirmDeleteModal.hide();
        $scope.deleteIndex = null;
    };

    $scope.removeRow = function (index) {
        $scope.deleteIndex = index;
        confirmDeleteModal.$promise.then(function () {
            confirmDeleteModal.show();
        });
    };

});

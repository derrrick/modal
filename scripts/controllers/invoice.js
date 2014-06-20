'use strict';

var invoiceControllers;

invoiceControllers = angular.module('invoiceControllers', []);

invoiceControllers.controller('InvoiceDashCtrl', function($scope, $state) {
    $scope.subnavmenuitems = [
		{sref: 'invoice', name: 'All'},
		{sref: 'invoice', name: 'Sent'},
		{sref: 'invoice', name: 'Late'},
		{sref: 'invoice', name: 'Drafts'}
    ];

    if ($state.current.name == 'invoice') $state.go('invoice.invoices');
});

invoiceControllers.controller('InvoiceInvoicesCtrl', function($scope, $modal, growl, Restangular) {

    $scope.invoicesList = Restangular.all('invoices').getList().$object;

});
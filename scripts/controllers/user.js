'use strict';

var userControllers = angular.module('userControllers', []);

userControllers.controller('UserSignupCtrl', function($scope, $state, growl, Restangular) {
    $scope.submitted = false;

    $scope.signup = function(isValid) {
        $scope.submitted = true;
        if (isValid) {
            var rAccounts = Restangular.all('accounts/free');
            rAccounts.post($scope.newSignup).then(function(resp) {
                console.log(JSON.stringify(resp));
                $state.go('confirm-email');
            }), function() {
                // registration failed for some reason
                console.log(JSON.stringify(resp));
                growl.error('Oh snap! Change a few things up and try submitting again.', {ttl: 5000});
            };
        }
    };
});

userControllers.controller('UserLoginCtrl', function($scope, $state, $rootScope, growl, AUTH_EVENTS, AuthService, Session) {
    $scope.credentials = {
        username: '',
        password: ''
    };

    $scope.disableLoginButton = false;

    $scope.$on(AUTH_EVENTS.notAuthorized, function () {
        growl.warning('The username and password combination you used is invalid.', {ttl: 5000});
        $scope.disableLoginButton = false;
        Session.destroy();
        $state.go('login');
    });

    $scope.login = function (credentials) {
        $scope.disableLoginButton = true;
        AuthService.login(credentials).then( function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
        }, function () {
            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
        })
    };

    $scope.logout = function () {
        AuthService.logout().then(function () {
            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess);
        });
    }
});

userControllers.controller('SetupWizardCtl', function($scope, $state, Restangular) {
    $scope.submitted = false;
    $scope.newUser = {
        first_name: null,
        last_name: null,
        phone: null,
        project: {}
    };
    $scope.projects = Restangular.all('projects').getList().$object;
    $scope.saveNewUser = function() {
        $scope.submitted = true;
        if ($scope.newUser.first_name != null && $scope.newUser.last_name != null && $scope.newUser.project != null) {
            $scope.saveBtn = true;
            Restangular.one('users', $scope.ckGlobal.user.guid).customPUT({id: $scope.ckGlobal.user.guid,
                                                                    first_name: $scope.newUser.first_name,
                                                                    last_name: $scope.newUser.last_name,
                                                                    phone: $scope.newUser.phone}).then(function(rUser) {
               $scope.ckGlobal.user.first_name = $scope.newUser.first_name;
               $scope.ckGlobal.user.last_name = $scope.newUser.last_name;
               $scope.ckGlobal.user.full_name = $scope.newUser.first_name + ' ' + $scope.newUser.last_name;
               $scope.ckGlobal.user.phone = $scope.newUser.phone;
               Restangular.one('projects', $scope.newUser.project.id).all('users').post({project_id: $scope.newUser.project.id, user_id: $scope.ckGlobal.user.guid}).then(function() {
                   $state.go($scope.ckGlobal.default.landing);
               })
           });
        }
    };
});
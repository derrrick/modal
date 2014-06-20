'use strict';

var CrowdKeepApp;

CrowdKeepApp = angular.module('CrowdKeepApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngStorage',
//    'ngAnimate',
    'ui.router',
    'ui.select2',
    'ui.calendar',
    'mgcrea.ngStrap',
    'angular-growl',
    'ui.gravatar',
    'restangular',
    'angular-momentjs',
    'dashControllers',
    'timeControllers',
    'expenseControllers',
    'invoiceControllers',
    'scheduleControllers',
    'adminControllers',
    'accountControllers',
    'userControllers',
    'commonDirectives',
    'commonFilters'
]);

CrowdKeepApp.constant('AUTH_EVENTS', {
    loginSuccess: 'auth-login-success',
    loginFailed: 'auth-login-failed',
    logoutSuccess: 'auth-logout-success',
    sessionTimeout: 'auth-session-timeout',
    notAuthenticated: 'auth-not-authenticated',
    notAuthorized: 'auth-not-authorized',
    profileIncomplete: 'setup-profile-incomplete',
    trialExpired: 'bill-trial-expired',
    ccExpired: 'credit-card-expired'
});

CrowdKeepApp.constant('USER_ROLES', {
    all: '*',
    admin: 'admin',
    manager: 'manager',
    user: 'user'
});

CrowdKeepApp.config(function ($stateProvider, $urlRouterProvider, growlProvider, RestangularProvider, $datepickerProvider, $timepickerProvider, AUTH_EVENTS, USER_ROLES) {
    $stateProvider
        .state('api-test', {
            url: '/api-test',
            templateUrl: 'views/partials/api-test.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('upload', {
            url: '/upload',
            templateUrl: 'views/partials/upload.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('fixture', {
            url: '/fixture',
            templateUrl: 'views/partials/fixture.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('logout', {
            url: '/logout',
            templateUrl: 'views/partials/login.html',
            controller: 'UserLoginCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('login', {
            url: '/login',
            templateUrl: 'views/partials/login.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('register', {
            url: '/signup',
            templateUrl: 'views/partials/register.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('forgot-password', {
            url: '/forgot-password',
            templateUrl: 'views/partials/forgot-password.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('confirm-email', {
            url: '/confirm-email',
            templateUrl: 'views/partials/confirm-email.html',
            data: {
                authorizedRoles: []
            }
        })
        .state('confirm-email.confirm', {
            url: '/:userId/:hash',
            templateUrl: 'views/partials/confirm-email.html',
            controller: function ($scope, $state, growl, $stateParams, Restangular) {
                Restangular.all('confirm-email/'+$stateParams.userId+'/'+$stateParams.hash).get().then(function (resp) {
                    if (resp.status == 200) {
                        growl.success('Your account has been confirmed, please login...');
                        $state.go('login');
                    } else {
                        $state.go('register');
                    }
                }), function (resp) {
                    console.log('doh, confirm account failed');
                    $state.go('confirm-email');
                };
            },
            data: {
                authorizedRoles: []
            }
        })
        .state('wizard', {
            url: '/wizard',
            templateUrl: 'views/partials/wizard.html',
            controller: 'SetupWizardCtl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('dash', {
            url: '/dash',
            templateUrl: 'views/main.html',
            controller: 'DashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('inbox', {
            url: '^/inbox',
            parent: 'dash',
            templateUrl: 'views/partials/inbox.html',
            controller: 'InboxDashCtl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('account', {
            url: '/account',
            templateUrl: 'views/main.html',
            controller: 'AccountDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('account.billing', {
            url: '/billing',
            templateUrl: 'views/account/partials/account.billing.html',
            controller: 'AccountDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
//        .state('account.users', {
//            url: '/users',
//            templateUrl: 'views/account/partials/account.users.html',
//            controller: 'AccountDashCtrl'
//        })
        .state('account.settings', {
            url: '/settings',
            templateUrl: 'views/account/partials/account.settings.html',
            controller: 'AccountDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('account.notifications', {
            url: '/notifications',
            templateUrl: 'views/account/partials/account.notifications.html',
            controller: 'AccountDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin', {
            url: '/admin',
            templateUrl: 'views/admin_main.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.employees', {
            url: '/employees',
            templateUrl: 'views/admin/partials/admin.employees.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.employees_id', {
            url: '/employees/:id',
            templateUrl: 'views/admin/partials/admin.employees.profile.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.clients', {
            url: '/clients',
            parent: 'admin',
            templateUrl: 'views/admin/partials/admin.clients.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.clients_id', {
            url: '/clients/:id',
            templateUrl: 'views/admin/partials/admin.clients.id.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.projects', {
            url: '/projects',
            parent: 'admin',
            templateUrl: 'views/admin/partials/admin.projects.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.projects_id', {
            url: '/projects/:id',
            templateUrl: 'views/admin/partials/admin.projects.id.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.projects_id.task_id', {
            url: '/tasks/:task_id',
            templateUrl: 'views/admin/partials/admin.projects.id.task.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.positions', {
            url: '/positions',
            templateUrl: 'views/admin/partials/admin.positions.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('admin.settings', {
            url: '/settings',
            templateUrl: 'views/admin/partials/admin.settings.html',
            controller: 'AdminDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('expense', {
            url: '/expense',
            templateUrl: 'views/main.html',
            controller: 'ExpenseDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('expense.transactions', {
            url: '/transactions',
            templateUrl: 'views/expense/partials/expense.transactions.html',
            controller: 'ExpenseDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('invoice', {
            url: '/invoice',
            templateUrl: 'views/main.html',
            controller: 'InvoiceDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('invoice.invoices', {
            url: '/invoices',
            templateUrl: 'views/invoice/partials/invoice.invoices.html',
            controller: 'InvoiceDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('schedule', {
            url: '/schedule',
            templateUrl: 'views/main.html',
            controller: 'ScheduleDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('schedule.calendar', {
            url: '/calendar',
            templateUrl: 'views/schedule/partials/schedule.calendar.html',
            controller: 'ScheduleDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('time', {
            url: '/time',
            templateUrl: 'views/main.html',
            controller: 'TimeDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('time.reports', {
            url: '/reports',
            templateUrl: 'views/time/partials/time.reports.html',
            controller: 'TimeReportCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('time.reports.report', {
            url: '/:report',
            templateUrl: 'views/time/partials/time.reports.report.html',
            controller: function ($scope, $stateParams) {
                $scope.report = $stateParams.report;
            },
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        })
        .state('time.timesheets', {
            url: '/timesheets',
            templateUrl: 'views/time/partials/time.timesheets.html',
            controller: 'TimeDashCtrl',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.manager, USER_ROLES.user]
            }
        });
    $urlRouterProvider
        .when('', '/login');

    growlProvider.globalTimeToLive({success: 3000, error: 5000, warning: 3000, info: 3000});
    growlProvider.globalPosition('bottom-left');

    RestangularProvider.setBaseUrl('//api.crowdkeep.com/v1/');

    angular.extend($datepickerProvider.defaults, {
        dateFormat: 'dd/MM/yyyy',
        autoclose: true,
        startWeek: 1
    });

    angular.extend($timepickerProvider.defaults, {
        length: 3
    });
});

// Restangular service that uses Bing
CrowdKeepApp.factory('GoogleGeocode', function(Restangular) {
  return Restangular.withConfig(function(RestangularConfigurer) {
    RestangularConfigurer.setBaseUrl('https://maps.googleapis.com/maps/api/geocode/');
  });
});

/*
    Authentication factory service
 */
CrowdKeepApp.factory('AuthService', function (Restangular, Session) {
    return {
        // login user
        login: function (credentials) {
            return Restangular.all('accounts/login')
                .post(credentials)
                .then(function (resp) {
                    // create session after successful login
                    Session.create(resp);
                });
        },
        // logout user
        logout: function () {
            return Restangular.all('accounts/logout')
                .get()
                .then(function () {
                    Session.destroy();
                });
        },
        // is this user authenticated
        isAuthenticated: function () {
            return !!Session.token;
        },
        // is this user authorized
        isAuthorized: function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (this.isAuthenticated() &&
                authorizedRoles.indexOf(Session.user.role) !== -1);
        },
        isValidAccount: function () {
            return true;
        },
        isProfileComplete: function () {
            return !!Session.user.full_name;
        }
    };
});

/*
    Session factory and management
 */
CrowdKeepApp.service('Session', function ($localStorage, $http) {
    // initialize session
    this.init = function () {
        this.user = {role: 'guest', guid: null};
        this.token = null;
    };
    // create session
    this.create = function (response) {
        $localStorage.crowdkeep = response;
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + response.token;
        this.token = response.token;
        this.user = angular.copy(response);
        // TODO: remove the next line once server returns proper roles
        _.extend(this.user, {role: 'admin'});
    };
    // destroy session
    this.destroy = function () {
        delete $localStorage.crowdkeep;
        // because restangular does not seem to have a delete
        delete $http.defaults.headers.common['Authorization'];
        this.token = null;
        this.user = {guid: null, role: 'guest'};
    };
    return this;
})

/*
    Main Controller
    Loaded on every page as the top scope controller
    vars:
        navmenuitems: determines the list of menu items and their order - this should ideally be loaded from the api at some point in the future
        ckGlobal: a global variable which houses the logged in user and other defaults for the app

    watches for broadcast events and handles them
 */
CrowdKeepApp.controller('MainCtrl', function ($scope, $state, USER_ROLES, AUTH_EVENTS, growl, Session, AuthService) {
    // sidebar navigation menu items
    $scope.navmenuitems = [
        {sref: 'inbox', icon: 'stroke inbox-3', name: 'Inbox'},
        {sref: 'time.timesheets', icon: 'solid stopwatch-1', name: 'Timesheets'},
        {sref: 'expense.transactions', icon: 'solid money-1', name: 'Expense'},
//        {sref: 'schedule', icon: 'solid clipboard-4', name: 'Schedule'},
        {sref: 'invoice.invoices', icon: 'solid newspaper-3', name: 'Invoice'}
    ];
    // global variable
    $scope.ckGlobal = {user: {role: 'guest', guid: null}, default: {landing: 'time'}};
    $scope.userRoles = USER_ROLES;
    $scope.isAuthorized = AuthService.isAuthorized;

    // watches for notAuthenticated broadcasts
    $scope.$on(AUTH_EVENTS.notAuthenticated, function () {
        Session.destroy();
        $state.go('login');
    });

    // watches for notAuthorized broadcasts
    $scope.$on(AUTH_EVENTS.notAuthorized, function () {
        event.preventDefault();
    });

    // watches for logoutSuccess broadcasts
    $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
        $scope.ckGlobal = {user: null, default: {}};
        Session.destroy();
        $state.go('login');
    });

    // watches for loginSuccess broadcasts
    $scope.$on(AUTH_EVENTS.loginSuccess, function () {
        // set global variable with user data
        $scope.ckGlobal.user = angular.copy(Session.user);
        if (!$scope.ckGlobal.user.confirmed) {
            $state.go('confirm-email');
        }
        // forward user to default landing page
        $state.go($scope.ckGlobal.default.landing);
    });

    $scope.$on(AUTH_EVENTS.profileIncomplete, function () {
        $state.go('wizard');
    });
});

CrowdKeepApp.controller('FixtureGenerator', function ($scope, $http, Restangular) {
    Restangular.all('accounts/login').post({username: 'sina@crowdkeep.com', password: 'partyparty'}).then(function (resp) {
        if (testRes('Login User', resp)) {
            $scope.savedInfo.guid = resp.data.guid;
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + resp.data.token;
            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'A' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                testRes('Create user A', resp);
                $scope.user1 = resp.data.id;
            });
            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'B' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                testRes('Create user B', resp);
                $scope.user2 = resp.data.id;
            });
            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'C' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                testRes('Create user C', resp);
                $scope.user3 = resp.data.id;
            });
            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'D' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                testRes('Create user D', resp);
                $scope.user4 = resp.data.id;
            });
            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'E' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                testRes('Create user E', resp);
                $scope.user5 = resp.data.id;
            });
            Restangular.all('clients').post({name: 'test client 1'}).then(function (resp) {
                if (testRes('Create client 1', resp)) {
                    Restangular.all('projects').post({name: 'sample project 1', client_id: resp.data.id}).then(function (resp) {
                        if (testRes('Create project', resp)) {
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user1}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user3}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user5}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                        }
                    });
                }

            });
            Restangular.all('clients').post({name: 'test client 2'}).then(function (resp) {
                if (testRes('Create client 2', resp)) {
                    Restangular.all('projects').post({name: 'sample project 2', client_id: resp.data.id}).then(function (resp) {
                        if (testRes('Create project', resp)) {
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user2}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user4}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user5}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                        }
                    });
                }
            });
            Restangular.all('clients').post({name: 'test client 3'}).then(function (resp) {
                if (testRes('Create client 3', resp)) {
                    Restangular.all('projects').post({name: 'sample project 3', client_id: resp.data.id}).then(function (resp) {
                        if (testRes('Create project', resp)) {
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user1}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user4}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user2}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                        }
                    });
                }
            });
            Restangular.all('clients').post({name: 'test client 4'}).then(function (resp) {
                if (testRes('Create client 4', resp)) {
                    Restangular.all('projects').post({name: 'sample project 4', client_id: resp.data.id}).then(function (resp) {
                        if (testRes('Create project', resp)) {
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user3}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user4}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                            Restangular.one('projects', resp.data.id).customPOST('users', {user_id: $scope.user5}).then(function (resp) {
                                testRes('assign user to project', resp);
                            });
                        }
                    });
                }
            });
        }
    });
});

CrowdKeepApp.controller('APITestCtrl', function ($scope, $http, Restangular) {
    $scope.tests = [];
    $scope.savedInfo = {};
    var testRes = function (name, resp) {
        console.log(name);
        if (resp.status === 200) {
            var result = true;
        } else {
            var result = false;
        }
        $scope.tests.push({name: name, output: resp, result: result});
        return result;
    };
    Restangular.setErrorInterceptor(function (resp) {
        return testRes(resp.config.url, resp)
    });
    Restangular.setFullResponse(true);
    $scope.savedInfo.registerEmail = moment()+'@test.com';
    Restangular.all('accounts/free').post({email: $scope.savedInfo.registerEmail, password: 'test1234'}).then(function (resp) {
        if (testRes('Register User', resp)) {
            Restangular.all('accounts/login').post({username: $scope.savedInfo.registerEmail, password: 'test1234'}).then(function (resp) {
                if (testRes('Login User', resp)) {
                    $scope.savedInfo.guid = resp.data.guid;
                    $http.defaults.headers.common['Authorization'] = 'Bearer ' + resp.data.token;
                    Restangular.one('users', $scope.savedInfo.guid).get().then(function (resp) {
                        if (testRes('Get User', resp)) {
                            resp.data.last_name = 'Changed lname';
                            resp.data.first_name = 'Changed fname';
                            resp.data.put().then(function (resp) {
                                testRes('Change User first and last names', resp);
                            });
                        }
                    });
                    Restangular.all('users').getList().then(function (resp) {
                        if (testRes('Get all users', resp)) {
                            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'A' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                                if (testRes('Create user A', resp)) {
                                    Restangular.all('users').getList().then(function (resp) {
                                        testRes('Get all users after create', resp);
                                    });
                                }
                            });
                            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'B' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                                testRes('Create user B', resp);
                            });
                            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'C' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                                testRes('Create user C', resp);
                            });
                            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'D' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                                testRes('Create user D', resp);
                            });
                            Restangular.all('users').post({first_name: 'fname', last_name: 'lname', email: 'E' + moment() + '@test.com', phone_number: '1234567890'}).then(function (resp) {
                                testRes('Create user E', resp);
                            });
                            Restangular.all('users').getList().then(function (resp) {
                                if (testRes('Get all users after create', resp)) {
                                    console.log('done users')
                                }
                            });
                        }
                    });
                    Restangular.all('job-titles').getList().then(function (resp) {
                        if (testRes('Get User Job Titles', resp)) {
                            Restangular.all('job-titles').post({name: 'Sample Job Title'}).then(function (resp) {
                                if (testRes('Create Job Title', resp)) {
                                    $scope.savedInfo.jobtitleid = resp.data.id;
                                    resp.data.name = 'Changed Job Title';
                                    resp.data.put().then(function (resp) {
                                        testRes('Change Job Title', resp);
                                    });
                                    Restangular.one('users', $scope.savedInfo.guid).all('job-titles').post({id: $scope.savedInfo.jobtitleid, hourly_rate: 100.91}).then(function (resp) {
                                        if (testRes('Assign Job Title to User', resp)) {
                                            // TODO: Delete job title
                                        }
                                    });
                                }
                            });
                        }
                    });
                    Restangular.all('clients').getList().then(function(resp) {
                        if (testRes('543 - Get all Clients', resp)) {
                            resp.data.post({name: 'test client'}).then(function (resp) {
                                if (testRes('545 - Create client', resp)) {
                                    $scope.savedInfo.clientid = resp.data.id;
                                    Restangular.one('clients', $scope.savedInfo.clientid).get().then(function (resp) {
                                        testRes('548 - Get Client', resp);
                                        resp.data.name = 'Changed Client Name';
                                        resp.data.put().then(function(resp){
                                            testRes('551 -Update Client Name', resp);
                                        });
                                    });
                                    Restangular.all('projects').getList().then(function(resp){
                                        if (testRes('555 - Get all projects', resp)) {
                                            resp.data.post({name: 'sample project', client_id: $scope.savedInfo.clientid}).then(function (resp) {
                                                if (testRes('557 - Create project', resp)) {
                                                    $scope.savedInfo.projectid = resp.data.id;
                                                    Restangular.one('projects', $scope.savedInfo.projectid).get().then(function (resp) {
                                                        testRes('560 - Get project', resp);
                                                    });
                                                    Restangular.one('projects', $scope.savedInfo.projectid).customPOST({project_id: $scope.savedInfo.projectid, user_id: $scope.savedInfo.guid}, 'users').then(function (resp) {
                                                        if (testRes('563 - Assign user to project', resp)) {
                                                            Restangular.one('projects', $scope.savedInfo.projectid).one('users', $scope.savedInfo.guid).remove().then(function (resp) {
                                                                if (testRes('Un-assign user from project', resp)) {
                                                                    console.log('done project');
                                                                }
                                                            });
                                                        }
                                                    });
                                                    Restangular.one('projects', $scope.savedInfo.projectid).all('tasks').getList().then(function(resp){
                                                        if (testRes('Get All Tasks', resp)) {
                                                            Restangular.all('tasks').post({name: 'Sample Task', project_id: $scope.savedInfo.projectid, description: 'sample task description'}).then(function (resp) {
                                                                if (testRes('Create task for project', resp)) {
                                                                    $scope.savedInfo.taskid = resp.data.id;
                                                                    resp.data.name = "Change Sample Task Name";
                                                                    resp.data.put().then(function (resp) {
                                                                        if (testRes('Change task name', resp)) {
                                                                            Restangular.one('projects', $scope.savedInfo.projectid).all('tasks').getList().then(function (resp) {
                                                                                if (testRes('List all tasks in project', resp)) {
                                                                                    Restangular.one('users', $scope.savedInfo.guid).all('time', {start: moment().day(1).format('YYYY-MM-DD'), end: moment().day(7).format('YYYY-MM-DD')}).getList().then(function (resp) {
                                                                                        if (testRes('Get User Timesheet for this week', resp)) {
                                                                                            Restangular.all('time').all('hours').post({user_id: $scope.savedInfo.guid, date: moment().format('YYYY-MM-DD'), hours: 3.5, task_id: $scope.savedInfo.taskid, project_id: $scope.savedInfo.projectid}).then(function (resp) {
                                                                                                if (testRes('Add time to timesheet', resp)) {
                                                                                                    Restangular.one('time', resp.data.id).customGET('hours').then(function (resp) {
                                                                                                        if (testRes('Get timesheet entry by id', resp)) {
                                                                                                            resp.data.hours = 8;
                                                                                                            resp.data.customPUT(resp.data,'hours').then(function (resp) {
                                                                                                                if (testRes('Update time in timesheet', resp)) {
                                                                                                                    resp.data.id.remove().then(function(resp){
                                                                                                                        testRes('Delete Timesheet Entry', resp)
                                                                                                                    });
                                                                                                                }
                                                                                                            });
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        }
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                    Restangular.all('expense').getList().then(function(resp){
                                                       if (testRes('Get all Expenses', resp)) {
                                                           resp.data.post({name: 'cvs pharmacy', task_id: $scope.savedInfo.taskid, project_id: $scope.savedInfo.projectid, description: 'bandaids for paper cut', amount: 6.99, date: moment().format('YYYY-MM-DD'), user_id: $scope.savedInfo.guid}).then(function(resp){
                                                               if (testRes('Create expense', resp)) {
                                                                   Restangular.one('expense', resp.data.id).get().then(function(resp){
                                                                      if (testRes('Get expense by id', resp)) {
                                                                          resp.data.description = 'got bandaids for papercut because none in office';
                                                                          resp.data.put().then(function(resp1){
                                                                              if (testRes('Update expense', resp1)) {
                                                                                  resp.data.remove().then(function(resp){
                                                                                      testRes('Delete Expense', resp)
                                                                                  });
                                                                              }
                                                                          });
                                                                      }
                                                                   });
                                                               }
                                                           });
                                                       }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

//CrowdKeepApp.run(function($rootScope, $route) {
//    $rootScope.$on('$stateChangeSuccess', function(currentRoute, previousRoute){
//      //Change page title, based on Route information
//      $rootScope.title = $route.current.title;
//    });
//  });

CrowdKeepApp.run(function ($rootScope, AUTH_EVENTS, AuthService, Session, $localStorage, growl, Restangular) {
    $rootScope.$on('$stateChangeStart', function (event, next) {
        var authorizedRoles = next.data.authorizedRoles;
        if (authorizedRoles.length) {
            if (!Session.hasOwnProperty('token') && $localStorage.hasOwnProperty('crowdkeep')) {
                Session.create($localStorage.crowdkeep);
                $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
            }
            if (!AuthService.isAuthenticated()) {
                event.preventDefault();
                $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
            } else if (!AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                // user is not allowed
                $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
            }
        }
    });
    /*
        Intercepts any non 2xx codes returned from the server
        Those errors are captured and handled here.
    */
    Restangular.setErrorInterceptor(function(response, op, what, url) {
        if (response.status === 400) {
            // TODO: add message returned from server
            growl.error('Bad Request - insert error message returned from server here', {ttl: 5000});
        }
        if (response.status === 401) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated,
                response);
        }
        if (response.status === 403) {
            $rootScope.$broadcast(AUTH_EVENTS.notAuthorized,
                response);
        }
        if (response.status === 419 || response.status === 440) {
            $rootScope.$broadcast(AUTH_EVENTS.sessionTimeout,
                response);
        }
    });
});
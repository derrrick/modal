'use strict';

var adminControllers;

adminControllers = angular.module('adminControllers', []);

adminControllers.controller('AdminDashCtrl', function($scope, $state) {
    $scope.subnavmenuitems = [
		{sref: 'admin.employees', name: 'Employees'},
		{sref: 'admin.clients', name: 'Clients'},
		{sref: 'admin.projects', name: 'Projects'},
		{sref: 'admin.positions', name: 'Positions'},
//		{sref: 'admin.settings', name: 'Settings'}
    ];
    if ($state.current.name == 'admin') $state.go('admin.employees');

    $scope.exitAdmin = function() {
        $state.go($scope.ckGlobal.default.landing);
    }
});

adminControllers.controller('AdminEmpCtrl', function($scope, $modal, growl, Restangular) {
    var addEmployeeModal = $modal({scope: $scope, template: '/views/templates/modal.employee.add.html', show: false});
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});

    var resetAddEmployee = function() {
        $scope.NewEmp = {
            first_name: null,
            last_name: null,
            email: null,
            phone_number: null
        }
    }

    $scope.listStyle = "cards";
    $scope.addSubmitted = false;
    var rUsers = Restangular.all('users');
    $scope.employees = rUsers.getList().$object;

	$scope.saveNewEmployee = function(validForm) {
        $scope.addSubmitted = true;
        if (validForm) {
            addEmployeeModal.hide();
            rUsers.post($scope.NewEmp).then(function (newUser) {
                _.extend($scope.NewEmp, {full_name: $scope.NewEmp.first_name + ' ' + $scope.NewEmp.last_name, id: newUser.id});
                $scope.employees.push($scope.NewEmp);
                growl.success("Saved...");
            }, function () {
                growl.error("Uh Oh! Did not save...");
            });
        }
	};

    $scope.switchListType = function() {
        if ($scope.listStyle == "cards") {
            $scope.listStyle = "list";
        } else {
            $scope.listStyle = "cards";
        }
    }

	$scope.removeEmployee = function(index) {
		$scope.employees.splice(index, 1);
	};

    $scope.confirmDelete = function() {
        confirmDeleteModal.hide();
        var employeeRow = $scope.employees[$scope.deleteIndex];
        if (employeeRow.id) {
            Restangular.one('users', employeeRow.id).remove().then(function(){
                $scope.employees.splice($scope.deleteIndex, 1)
                growl.success('Deleted...');
            }, function(){
                growl.error('Uh Oh! Did not delete...');
            });
        }
        $scope.deleteIndex = null;
        $scope.toBeDeleted = null;
    };

    $scope.cancelDelete = function() {
        confirmDeleteModal.hide();
        $scope.deleteIndex = null;
        $scope.toBeDeleted = null;
    };

    $scope.removeRow = function(index) {
        $scope.deleteIndex = index;
        $scope.toBeDeleted = $scope.employees[index].full_name;
        confirmDeleteModal.$promise.then(function() {
            confirmDeleteModal.show();
        });
    };

    $scope.openAddEmployee = function() {
        resetAddEmployee();
        addEmployeeModal.$promise.then(addEmployeeModal.show);
    };

    $scope.cancelAddEmployee = function() {
        addEmployeeModal.hide();
        resetAddEmployee();
    };

//    $scope.toggleGroup = function(groupId) {
//        var idx = $scope.addEmployee.groups.indexOf(groupId);
//        if (idx > -1) {
//            $scope.addEmployee.groups.splice(idx, 1);
//        } else {
//            $scope.addEmployee.groups.push(groupId);
//        }
//    };
});

adminControllers.controller('AdminEmpIdCtrl', function($scope, $state, $stateParams, $modal, growl, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});

    Restangular.one('users', $stateParams.id).get().then(function(resp) {
        $scope.employee = resp;
        $scope.masterEmployee = angular.copy($scope.employee);
    });

    $scope.saveEmployee = function(employee) {
        if (!angular.equals(employee, $scope.masterEmployee)) {
            $scope.employee.put().then(function (resp) {
                $scope.masterEmployee = angular.copy(employee);
                growl.success("Saved");
            });
        }
    };

    $scope.confirmDelete = function() {
        confirmDeleteModal.hide();
        $scope.employee.remove().then(function(){
                growl.success('Deleted...');
                $state.go('admin.employees');
            }, function(){
                growl.error('Uh Oh! Did not delete...');
            });
    };

    $scope.cancelDelete = function() {
        confirmDeleteModal.hide();
    };

    $scope.removeRow = function() {
        confirmDeleteModal.$promise.then(function() {
            confirmDeleteModal.show();
        });
    };

});

adminControllers.controller('AdminClientCtrl', function($scope, $modal, growl, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
    var addClientModal = $modal({scope: $scope, template: '/views/templates/modal.client.add.html', show: false});
    var editClientModal = $modal({scope: $scope, template: '/views/templates/modal.client.edit.html', show: false});

    $scope.addSubmitted = false;
    $scope.deleteIndex = null;

    var resetAddClient = function() {
        $scope.NewClient = {
            name: null,
            phone: null,
            description: null
        }
        $scope.addSubmitted = false;
    };

    var rClients = Restangular.all('clients');
	$scope.clientsList = rClients.getList().$object;

    $scope.editClient = function(index) {
        editClientModal.$promise.then(function() {
            $scope.myClient = $scope.clientsList[index];
            editClientModal.show();
        });
    };

    $scope.cancelEditClient = function() {
        editClientModal.hide();
    };

    $scope.saveEditClient = function(saveClient) {
        editClientModal.hide();
        Restangular.one('clients', saveClient.client_id).customPUT(saveClient).then(function(resp) {
           growl.success('Saved...');
        }, function () {
            growl.error("Uh Oh! Did not save...");
        });
    };

    $scope.createClient = function() {
        $scope.disableCreateClientButton = true;
        $scope.createClientPane = true;
    };

    $scope.openAddClient = function() {
        resetAddClient();
        addClientModal.$promise.then(addClientModal.show);
    };

    $scope.saveNewClient = function(validForm) {
        $scope.addSubmitted = true;
        if (validForm) {
            addClientModal.hide();
            rClients.post($scope.NewClient).then(function (newClient) {
                growl.success("Saved...");
                $scope.clientsList.push(newClient);
            }, function () {
                growl.error("Uh Oh! Did not save...");
            });
        }
    };

//    $scope.getClientProjects = function(clientId) {
//        Restangular.one('clients', clientId).all('projects').getList().then(function(projects){
//            $scope.clientProjectsList = projects;
//            $apply();
//        });
//    };

//    $scope.assignUsers = function(index) {
//        Restangular.all('users').all('all').getList().then(function(users) {
//            angular.forEach(users, function(user) {
//                _.extend(user, {inGroup: false});
//                angular.forEach(user.clientsList, function(client) {
//                   if (client.id == $scope.clientsList[index].id) {
//                       user.inClient = true;
//                   }
//                });
//            });
//            $scope.users = users;
//        });
//    };
//
//    $scope.assignUserGroupStatus = function(index) {
//        if (!$scope.users[index].inGroup) {
//            Restangular.one('groups', $scope.groups[index].id).one('users', $scope.users[index].id).remove();
//            $scope.groups[index].count -= 1;
//        } else {
//            Restangular.one('groups', $scope.groups[index].id).all('users').post({user_id: $scope.users[index].id});
//            $scope.groups[index].count += 1;
//        }
//    };

    $scope.cancelCreateClient = function() {
        $scope.createClientPane = false;
        $scope.disableCreateClientButton = false;
    };

    $scope.confirmDelete = function() {
        confirmDeleteModal.hide();
        var clientRow = $scope.clientsList[$scope.deleteIndex];
        if (clientRow.id) {
            Restangular.one('clients', clientRow.id).remove().then(function(){
                growl.success('Deleted...');
            }, function(){
                growl.error('Uh Oh! Did not delete...');
            });
        } else {
            growl.success('Deleted...');
        }
        $scope.clientsList.splice($scope.deleteIndex, 1)
        $scope.deleteIndex = null;
        if ($scope.disableCreateClientButton) {
            $scope.disableCreateClientButton = false;
        }
    };

    $scope.cancelDelete = function() {
        confirmDeleteModal.hide();
        $scope.deleteIndex = null;
    };

    $scope.removeRow = function(index) {
        $scope.deleteIndex = index;
        confirmDeleteModal.$promise.then(function() {
            confirmDeleteModal.show();
        });
    };

});

//adminControllers.controller('AdminClientIdCtrl', function($scope, $stateParams, $modal, growl, Restangular) {
//    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
//
//    $scope.createProjectPane = false;
//    $scope.disableCreateProjectButton = false;
//    $scope.submitted = false;
//
//    var rClient = Restangular.one('clients', $stateParams.id);
//    $scope.client = rClient.get().$object;
//    $scope.projectsList = rClient.all('projects').getList().$object;
//
//    $scope.createNewProject = function() {
//        $scope.createProjectPane = true;
//        $scope.disableCreateProjectButton = true;
//    };
//
//    $scope.cancelCreateProject = function() {
//        $scope.createProjectPane = false;
//        $scope.disableCreateProjectButton = false;
//    }
//
//    $scope.saveNewProject = function(project) {
//        $scope.createProjectPane = false;
//        Restangular.one('clients', $stateParams.id).all('projects').post(_.extend(project, {client_id: $stateParams.id})).then(function(resp) {
//            growl.success("Saved...");
//            $scope.projectsList.push(resp);
//            $scope.disableCreateProjectButton = false;
//        }, function() {
//            growl.error("Uh Oh! Did not save...");
//        });
//    }
//
//    $scope.confirmDelete = function() {
//        confirmDeleteModal.hide();
//        var projectRow = $scope.projectsList[$scope.deleteIndex];
//        if (projectRow.id) {
//            Restangular.one('projects', projectRow.id).remove().then(function(){
//                growl.success('Deleted...');
//            }, function(){
//                growl.error('Uh Oh! Did not delete...');
//            });
//        } else {
//            growl.success('Deleted...');
//        }
//        $scope.projectsList.splice($scope.deleteIndex, 1)
//        $scope.deleteIndex = null;
//        if ($scope.disableCreateProjectButton) {
//            $scope.disableCreateProjectButton = false;
//        }
//    };
//
//    $scope.cancelDelete = function() {
//        confirmDeleteModal.hide();
//        $scope.deleteIndex = null;
//    };
//
//    $scope.removeRow = function(index) {
//        $scope.deleteIndex = index;
//        confirmDeleteModal.$promise.then(function() {
//            confirmDeleteModal.show();
//        });
//    };
//
//});

adminControllers.controller('AdminProjectCtrl', function($scope, $modal, growl, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
    var addProjectModal = $modal({scope: $scope, template: '/views/templates/modal.project.add.html', show: false});

    $scope.addSubmitted = false;
    $scope.deleteIndex = null;

    var rClients = Restangular.all('clients');
    $scope.clientsList = rClients.getList().$object;

    $scope.clientProjects = function(clientId) {
        return _.where($scope.projectsList, {client_id: clientId});
    };

//    $scope.projectsByClient = Restangular.all('clients').getList().then(function (clients) {
//        angular.forEach(clients, function(client) {
//            _.extend(client, Restangular.one('clients', client.id).all('projects').getList().then(function(projects) {
//                angular.forEach(projects, function (project) {
//                    _.extend(project, Restangular.one('projects', project.id).all('users').getList().$object);
//                });
//            }));
//        });
//    });

    $scope.createProject = function() {
        addProjectModal.$promise.then(addProjectModal.show);
    };

    $scope.saveNewProject = function(isValid, newProject) {
        $scope.addSubmitted = true;
        if (isValid) {
            Restangular.all('projects').post(newProject).then(function (resp) {
                growl.success("Saved...");
                addProjectModal.hide();
                $scope.clientsList = rClients.getList().$object;
            }, function () {
                growl.error("Uh Oh! Did not save...");
            });
        }
    };

    $scope.closeAddProject = function() {
        addProjectModal.hide();
    };

    $scope.confirmDelete = function() {
        confirmDeleteModal.hide();
        var ProjectRow = $scope.ProjectsList[$scope.deleteIndex];
        if (ProjectRow.id) {
            Restangular.one('projects', ProjectRow.id).remove().then(function(){
                growl.success('Deleted...');
            }, function(){
                growl.error('Uh Oh! Did not delete...');
            });
        } else {
            growl.success('Deleted...');
        }
        $scope.ProjectsList.splice($scope.deleteIndex, 1)
        $scope.deleteIndex = null;
        if ($scope.disableCreateProjectButton) {
            $scope.disableCreateProjectButton = false;
        }
    };

    $scope.cancelDelete = function() {
        confirmDeleteModal.hide();
        $scope.deleteIndex = null;
    };

    $scope.removeRow = function(index) {
        $scope.deleteIndex = index;
        confirmDeleteModal.$promise.then(function() {
            confirmDeleteModal.show();
        });
    };

});

adminControllers.controller('AdminProjectIdCtrl', function($scope, $state, $stateParams, $modal, $filter, growl, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
    var assignUserModal = $modal({scope: $scope, template: '/views/templates/modal.project.user.assign.html', show: false});

    $scope.createTaskPane = false;
    $scope.disableCreateTaskButton = false;
    $scope.submitted = false;
    $scope.assignUser = {};

    var rProject = Restangular.one('projects', $stateParams.id);

    rProject.get().then(function(resp) {
        $scope.project = resp;
        $scope.masterProject = angular.copy($scope.project);
    });

    $scope.projectUsers = rProject.all('users').getList().$object;

    $scope.saveProject = function(project) {
        console.log('master: '+JSON.stringify($scope.masterProject)+'\nproject: '+JSON.stringify(project));
        if (!angular.equals(project, $scope.masterProject)) {
            $scope.project.customPUT(project).then(function (resp) {
                $scope.masterProject = angular.copy(project);
                growl.success("Saved");
            });
        }
    };

    $scope.assignUserToProject = function(project) {
        Restangular.all('users').getList().then(function(users) {
            Restangular.one('projects', project.id).all('users').getList().then(function(usersInProject) {
                $scope.usersList = _.difference(users, usersInProject);
                $scope.positionsList = Restangular.one('projects', project.id).all('job-titles').getList().$object;
                assignUserModal.show();
            });
        });
    };

    $scope.cancelAssignUserToProject = function() {
        assignUserModal.hide();
    };

    $scope.updateRates = function(index) {
        $scope.assignUser.rate_billable = angular.copy($scope.positionsList[index].rate_billable);
        $scope.assignUser.rate_hourly = angular.copy($scope.positionsList[index].rate_cost);
    };

    $scope.assignUserProject = function(assignUser) {
        Restangular.one('projects', $scope.positionsList[assignUser.position_idx].project_id).all('users').post(_.extend(assignUser, {job_title_id: $scope.positionsList[assignUser.position_idx].id})).then(function(resp){
            $scope.projectUsers.push(resp);
            assignUserModal.hide();
            growl.success('Saved...');
        });
    };

//    $scope.createNewTask = function() {
//        $scope.createTaskPane = true;
//        $scope.disableCreateTaskButton = true;
//    };
//
//    $scope.cancelCreateTask = function() {
//        $scope.createTaskPane = false;
//        $scope.disableCreateTaskButton = false;
//    };
//
//    $scope.saveNewTask = function(task) {
//        $scope.createTaskPane = false;
//        Restangular.all('tasks').post(_.extend(task, {project_id: $stateParams.id})).then(function(resp) {
//            growl.success("Saved...");
//            $scope.tasksList.push(resp);
//            $scope.disableCreateTaskButton = false;
//        }, function() {
//            growl.error("Uh Oh! Did not save...");
//        });
//    };

    $scope.confirmDelete = function() {
        confirmDeleteModal.hide();
        $scope.project.remove().then(function(){
                growl.success('Deleted...');
                $state.go('admin.projects');
            }, function(){
                growl.error('Uh Oh! Did not delete...');
            });
    };

    $scope.cancelDelete = function() {
        confirmDeleteModal.hide();
        $scope.deleteIndex = null;
    };

    $scope.removeRow = function(index) {
        $scope.deleteIndex = index;
        confirmDeleteModal.$promise.then(function() {
            confirmDeleteModal.show();
        });
    };

});

//adminControllers.controller('AdminProjectIdTaskCtrl', function($scope, $stateParams, growl, Restangular) {
//    var rEmps = Restangular.all('users/all');
//    $scope.project = Restangular.one('projects', $stateParams.id).get().$object;
//    $scope.task = Restangular.one('tasks', $stateParams.task_id).get().$object;
//});

adminControllers.controller('AdminPositionsCtrl', function($scope, $modal, growl, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
    var addPositionModal = $modal({scope: $scope, template: '/views/templates/modal.position.add.html', show: false});

    $scope.addSubmitted = false;
    $scope.deleteIndex = null;

    var rPositions = Restangular.all('job-titles');
	$scope.positionsList = rPositions.getList().$object;

    $scope.createPosition = function() {
        addPositionModal.$promise.then(function() {
            Restangular.all('projects').getList().then(function(projects) {
                $scope.projectsList = projects;
                addPositionModal.show();
            });
        });
    };

    $scope.cancelCreatePosition = function() {
        addPositionModal.hide();
    };

    $scope.saveNewPosition = function(newPosition) {
        addPositionModal.hide();
        rPositions.post(newPosition).then(function(resp) {
            growl.success("Saved...");
            $scope.positionsList.push(resp);
        }, function() {
          growl.error("Uh Oh! Did not save...");
        });
    };

    $scope.confirmDelete = function() {
        confirmDeleteModal.hide();
        var positionRow = $scope.positionsList[$scope.deleteIndex];
        Restangular.one('job-titles', positionRow.id).remove().then(function(){
            growl.success('Deleted...');
        }, function(){
            growl.error('Uh Oh! Did not delete...');
        });
        $scope.positionsList.splice($scope.deleteIndex, 1)
        $scope.deleteIndex = null;
    };

    $scope.cancelDelete = function() {
        confirmDeleteModal.hide();
        $scope.deleteIndex = null;
    };

    $scope.removeRow = function(index) {
        $scope.deleteIndex = index;
        confirmDeleteModal.$promise.then(function() {
            confirmDeleteModal.show();
        });
    };

});
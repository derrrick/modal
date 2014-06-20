var timeControllers = angular.module('timeControllers', []);

timeControllers.controller('TimeDashCtrl', function ($scope, $state) {
    $scope.subnavmenuitems = [
        {sref: 'time.timesheets', name: 'Timesheets'},
        {sref: 'time.reports', name: 'Reports'}
    ];
    console.log('state: '+JSON.stringify($state.current));
    if ($state.current.name === 'time') $state.go('time.timesheets');
});

//timeControllers.controller('TimeReportCtrl', function ($scope) {
//    $scope.subnavbuttons = [
//        {clickValue: 'addTime=True', name: 'Add Time'}
//    ];
//    $scope.reportList = [
//        {name: 'ReportTypeOne'},
//        {name: 'ReportTypeTwo'},
//        {name: 'ReportTypeThree'},
//        {name: 'ReportTypeFour'},
//        {name: 'ReportTypeFive'}
//    ];
//});

timeControllers.controller('TimeSheetCtrl', function ($scope, growl, $modal, Restangular) {
    var confirmDeleteModal = $modal({scope: $scope, template: '/views/templates/modal.confirm.delete.html', show: false});
    var addTimesheetRowModal = $modal({scope: $scope, template: '/views/templates/modal.timesheet.add.html', show: false});

    var blankWeek = {};

    var calcWeek = function () {
        $scope.thisWeek = [];
        $scope.weekHeader = [];
        for (var i = 0; i < 7; i++) {
            var today = moment($scope.weekStart).add('d', i);
            $scope.thisWeek.push(today.format("YYYY-MM-DD"));
            blankWeek[today.format("YYYY-MM-DD")] = {hours: 0, id: null};
            $scope.weekHeader.push({day: today.format("ddd"), date: today.format("Do")});
        }
    };

//    var taskOrderName = function (taskId) {
//        for (var i = 0; i < $scope.taskOrders.length; i++) {
//            if ($scope.taskOrders[i].id === taskId) {
//                return $scope.taskOrders[i].name;
//            }
//        }
//        return ">> not found <<";
//    };

//    var taskRow = function(taskId, taskName) {
//        return {task_id: taskId, task_name: taskName, week: blankWeek};
//    }

    var showTimesheet = function () {
        Restangular.one('users', $scope.ckGlobal.user.user_id).getList('time', {start: $scope.weekStart.format("YYYY-MM-DD"), end: $scope.weekEnd.format("YYYY-MM-DD")}).then(function (ts) {
            $scope.timesheets = [];
            $scope.projectsInTimesheet = [];
            for (var t = 0; t < ts.length; t++) {
                var tempts = {client_id: ts[t].client_id, client_name: ts[t].client_name, project_id: ts[t].project_id, project_name: ts[t].project_name};
                $scope.projectsInTimesheet.push(ts[t].project_id);
                var time = angular.copy(ts[t].time);
                var week = angular.copy(blankWeek);
                for (var i = 0; i < time.length; i++) {
                    week[moment(time[i].date).format("YYYY-MM-DD")] = {hours: time[i].hours, id: time[i].id};
                }
                _.extend(tempts, {week: week});
                $scope.timesheets.push(tempts);
                tempts = null;
                time = null;
                week = null;
            }
            $scope.masterTimesheets = angular.copy($scope.timesheets);
        });
        calcWeek();
    };

//    $scope.subnavbuttons = [
//        {clickValue: 'addTime=True', name: 'Add Time'}
//    ];
//    $scope.newTask = false;
    $scope.timesheets = [];
    $scope.todaysdate = moment().format("ddd MMM Do")
    $scope.weekEnd = moment().day(7);
    $scope.weekStart = moment().day(1);
//    $scope.projectsList = Restangular.one('users', $scope.ckGlobal.user.guid).all('projects').getList().$object;
    showTimesheet();
    // TODO: tasks are dependent on groups which are not being passed with user object
//    Restangular.one('projects', $scope.ckGlobal.user.group_id).all('tasks').getList().then(function (tos) {
//        $scope.taskOrders = tos;
//    });


    $scope.getDayHours = function (timeRow, dateInc) {
        if (typeof(timeRow[moment($scope.weekStart).add('d', dateInc).format("YYYY-MM-DD")]) !== 'undefined') {
            return timeRow[moment($scope.weekStart).add('d', dateInc).format("YYYY-MM-DD")].hours;
        } else {
            return 0;
        }
    };

    $scope.weekRange = function () {
        var rangeText = $scope.weekStart.format("DD");
        if ($scope.weekStart.month() !== $scope.weekEnd.month()) {
            rangeText += " " + $scope.weekStart.format("MMM");
        }
        if ($scope.weekStart.year() !== $scope.weekEnd.year()) {
            rangeText += " " + $scope.weekStart.format("YYYY");
        }
        rangeText += " - " + $scope.weekEnd.format("DD MMM YYYY");
        return rangeText;
    };

    $scope.goLastWeek = function () {
        $scope.weekStart = $scope.weekStart.subtract('d', 7);
        $scope.weekEnd = $scope.weekEnd.subtract('d', 7);
        showTimesheet();
    };

    $scope.goThisWeek = function () {
        $scope.weekEnd = moment().day(7);
        $scope.weekStart = moment().day(1);
        showTimesheet();
    };

    $scope.goNextWeek = function () {
        $scope.weekStart = $scope.weekStart.add('d', 7);
        $scope.weekEnd = $scope.weekEnd.add('d', 7);
        showTimesheet();
    };

    $scope.goToWeek = function (selDate) {
        $scope.weekEnd = moment(selDate).day(7);
        $scope.weekStart = moment(selDate).day(1);
        showTimesheet();
    }

//    var finishTask = function (task) {
//        $scope.timesheets.pop();
//        $scope.timesheets.push(task);
//        $scope.newTask = false;
//    };
//
//    $scope.setTask = function (task) {
//        if (typeof(task) === 'string' && task.length > 0) {
//            // create a new task and get id from api
//            var apiTasks = Restangular.all('tasks');
//            apiTasks.post({name: task, project_id: $scope.ckGlobal.user.project_id, description: ''}).then(function (replTask) {
//                task = replTask;
//                $scope.taskOrders.push(replTask);
//            });
//        }
//        newTask = taskRow(task.id, task.name);
//        finishTask(newTask);
//    };

//    $scope.canEditHours = function (row) {
//        if ($scope.newTask) {
//            return true;
//        } else {
//            return (typeof(row.task_id) === 'undefined');
//        }
//    };

    $scope.exportTimesheet = function () {
        return true;
    };

    $scope.saveHours = function (row, day, parentIdx) {
        if (row.week[day].hours != $scope.masterTimesheets[parentIdx].week[day].hours) {
            var saveData = {
                user_id: $scope.ckGlobal.user.user_id,
                date: moment(day).format('YYYY-MM-DD'),
                hours: row.week[day].hours,
                project_id: row.project_id,
                client_id: row.client_id
            };
            if (row.week[day].id === null) {
                if (row.week[day].hours > 0) {
                    var newTime = Restangular.all('time').all('hours');
                    newTime.post(saveData).then(function (resp) {
                        row.week[day].id = resp.id;
                        growl.sucess('Saved...');
                    });
                }
            } else {
                _.extend(saveData, {id: row.week[day].id});
                Restangular.one('time', row.week[day].id).customPUT(saveData, 'hours').then(function (resp) {
                    growl.success('Saved...');
                });
            }
            $scope.masterTimesheets[parentIdx].week[day] = angular.copy(row.week[day]);
        }
    };

    $scope.confirmDelete = function () {
        confirmDeleteModal.hide();
        var timesheetRow = $scope.timesheets[$scope.deleteIndex];
        for (var i = 0; i < $scope.thisWeek.length; i++) {
            if (timesheetRow.week[$scope.thisWeek[i]].id) {
                Restangular.one('time', timesheetRow.week[$scope.thisWeek[i]].id).remove().then(function(){
                    $scope.timesheets.splice($scope.deleteIndex, 1);
                    $scope.masterTimesheets = angular.copy($scope.timesheets);
                    growl.success('Deleted...');
                });
            }
        }
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

    $scope.sumTotalHours = function () {
        if ($scope.timesheets.length > 0) {
            var sumTotal = 0.00;
            angular.forEach($scope.timesheets, function(row) {
                sumTotal += _.reduce(_.pluck(_.values(row.week), 'hours'), function(memo, num) { return memo + num }, 0);
            });
            return sumTotal;
        } else {
            return 0.00;
        }
    };

    $scope.sumRowHours = function (row) {
        if (typeof(row) === 'undefined') {
            return 0.00;
        } else {
            return _.reduce(_.pluck(row.week, 'hours'), function(memo, num){ return memo + num}, 0);
        }
    };

    $scope.addTimesheetRow = function(projectsInTimesheet) {
        addTimesheetRowModal.$promise.then(function() {
            $scope.projectsList = [];
            Restangular.one('users', $scope.ckGlobal.user.user_id).all('projects').getList().then(function(projects) {
                angular.forEach(projects, function(project) {
                    if (projectsInTimesheet.indexOf(project.id) == -1) {
                        $scope.projectsList.push(project);
                    }
                });
                addTimesheetRowModal.show();
            });
        });
    };

    $scope.addRowToTimesheet = function(index) {
        addTimesheetRowModal.hide();
        console.log('index: '+index+' project: '+JSON.stringify($scope.projectsList[index]));
        var ts = $scope.projectsList[index];
        $scope.timesheets.push({client_id: ts.client_id, client_name: ts.client_name, project_id: ts.id, project_name: ts.name, week: angular.copy(blankWeek)});
        $scope.masterTimesheets = angular.copy($scope.timesheets);
    };

    $scope.cancelAddRowToTimesheet = function() {
        addTimesheetRowModal.hide();
        delete $scope.project_id;
    };

//    $scope.sumColumnHours = function (column) {
//        if (typeof(column) === 'undefined' || $scope.timesheets.length == 0) {
//            return 0.00;
//        } else {
//            var sumCol = 0.00;
//            angular.forEach($scope.timesheets, function(row) {
//                sumCol += parseFloat(row.week[column].hours);
//            });
//            return sumCol;
//        }
//    };
//
//    $scope.addTask = function () {
//        $scope.newTask = true;
//    };
//
//    $scope.setAddTimeTask = function (task) {
//        console.log('task: ' + task + ' type: ' + typeof(task));
//        if (typeof(task) === 'string') {
//            // create a new task and get id from api
//            var apiTasks = Restangular.all('tasks');
//            apiTasks.post({name: task, group_id: $scope.ckGlobal.user.group_id, description: ''}).then(function (replTask) {
//                $scope.taskOrders.push(replTask);
//                $scope.selectedAddTimeTask = replTask;
//            });
//        }
//    };

//    $scope.saveAddTime = function () {
//        // TODO: Add form validation
//        $scope.addTime = false;
//        var moreTime = Restangular.all('time');
//        var timeToAdd = {
//            user_id: $scope.ckGlobal.user.user_id,
//            start: moment($scope.selectedAddTimeDate).format('YYYY-MM-DD') + 'T' + moment($scope.selectedStartTime).format('HH:mm:ssZ'),
//            end: moment($scope.selectedAddTimeDate).format('YYYY-MM-DD') + 'T' + moment($scope.selectedEndTime).format('HH:mm:ssZ'),
//            task_id: $scope.selectedAddTimeTask.id
//        };
//        moreTime.post(timeToAdd).then(function () {
//                $scope.selectedAddTimeTask = null;
//                $scope.selectedAddTimeDate = null;
//                $scope.selectedStartTime = null;
//                $scope.selectedEndTime = null;
//                showTimesheet();
//            }
//        );
//    };

});

//timeControllers.controller('TimeAddCtrl', function ($scope, Restangular) {
//    $scope.employees = [
//        {id: 1, name: 'Jad Booustany'},
//        {id: 2, name: 'Mike Frye'},
//        {id: 3, name: 'Chris Wiggins'},
//        {id: 4, name: 'Peter Sellers'},
//        {id: 5, name: 'Charles Chaplin'},
//        {id: 6, name: 'Max Headroom'}
//    ];
//    $scope.taskOrders = [
//        {id: 1, name: 'do 1 thing'},
//        {id: 2, name: 'do 2 things'},
//        {id: 3, name: 'do funny thing'},
//        {id: 4, name: 'sell something'},
//        {id: 5, name: 'buy something'},
//        {id: 6, name: 'do multi-personalities'},
//        {id: 7, name: 'create fake data'},
//        {id: 8, name: 'ummm, ran out'}
//    ];
//    $scope.getTaskOrders = function (empId, taskOrders) {
//        var myTasks = [];
//        var employeeTaskOrders = [
//            {empId: 1, taskId: 4},
//            {empId: 1, taskId: 1},
//            {empId: 2, taskId: 2},
//            {empId: 3, taskId: 1},
//            {empId: 2, taskId: 5},
//            {empId: 5, taskId: 3},
//            {empId: 4, taskId: 6},
//            {empId: 6, taskId: 3},
//            {empId: 2, taskId: 7},
//            {empId: 6, taskId: 8},
//            {empId: 3, taskId: 8},
//            {empId: 5, taskId: 1}
//        ];
//        for (empTask in employeeTaskOrders) {
//            if (empTask.empId == empId) {
//                for (task in taskOrders) {
//                    if (task.id == empTask.taskId) {
//                        myTasks.push(task);
//                    }
//                }
//            }
//        }
//        if (myTasks.length == 0) {
//            myTasks.push({id: 0, name: 'slect and employee first'});
//        }
//        return myTasks;
//    }
////   $scope.getEmployee = function(val) {
////        employee = Restangular.all('Employee', val);
////   };
//});
//
//timeControllers.controller('TimeAsideCtrl', function ($scope, $aside) {
//    var addTimeAside = $aside({
//        scope: $scope,
//        template: 'views/time/templates/addtime.html'
//    });
//
//    addTimeAside.$promise.then(function () {
//        addTimeAside.show();
//    })
//});

// Date Picker Functionality

//timeControllers.controller('DatepickerCtrl', function($scope, $http) {
//
//  $scope.selectedDate = new Date();
//  $scope.selectedDateAsNumber = Date.UTC(1986, 1, 22);
//  // $scope.fromDate = new Date();
//  // $scope.untilDate = new Date();
//  $scope.getType = function(key) {
//    return Object.prototype.toString.call($scope[key]);
//  };
//
//  $scope.clearDates = function() {
//    $scope.selectedDate = null;
//  };
//
//});
//
//// Time Picker Functionality
//
//timeControllers.controller('TimepickerCtrl', function($scope, $http) {
//  $scope.time = new Date(1970, 0, 1, 10, 30);
//  $scope.selectedTimeAsNumber = 10 * 36e5;
//  $scope.selectedTimeAsString = '10:00';
//  $scope.sharedDate = new Date(new Date().setMinutes(0));
//});

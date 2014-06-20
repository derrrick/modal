'use strict';

var commonDirectives;
var commonFilters;

var selectedItem = function (menuitems, selected) {
    _(menuitems).each(function (menuitem) {
        menuitem.selected = false;
        if (selected === menuitem) {
            selected.selected = true;
        }
    });
};

commonDirectives = angular.module('commonDirectives', []);
commonFilters = angular.module('commonFilters', []);

commonDirectives.directive('reportSelector', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/report-selector.html',
        replace: false,
        scope: {
            reportList: '=',
            reportUrl: '@'
        },
        controller: ['$scope', function ($scope) {
            $scope.selectReport = selectedItem;
        }]
    };
});

commonDirectives.directive('ckNavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/navbar.html',
        replace: false,
        scope: {
            navMenuItems: '=',
            user: '='
        },
        controller: ['$scope', '$state', function ($scope, $state) {
            $scope.selectItem = selectedItem;
            $scope.highlightMenu = function (menuItem) {
                var url = menuItem + '.**';
                return $state.includes(url);
            };
        }]
    };
});

commonDirectives.directive('ckSideNavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/side_navbar.html',
        replace: false,
        scope: {
            navMenuItems: '='
        },
        controller: ['$scope', '$state', function ($scope, $state) {
            $scope.selectItem = selectedItem;
            $scope.highlightMenu = function (menuItem) {
                var url = menuItem + '.**';
                return $state.includes(url);
            };
        }]
    };
});

commonDirectives.directive('ckAdminSecondNavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/admin_second_navbar.html',
        replace: false,
        scope: {
            menuItems: '='
        },
        controller: ['$scope', '$state', function ($scope, $state) {
            $scope.selectItem = selectedItem;
            $scope.highlightMenu = function (menuItem) {
                var url = menuItem + '.**';
                return $state.includes(url);
            };
        }]
    };
});

commonDirectives.directive('ckTopNavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/top_navbar.html',
        replace: false,
        scope: {
            user: '='
        },

        controller: ['$scope', function ($scope) {
            $scope.selectItem = selectedItem;
        }]
    };
});

commonDirectives.directive('ckSecondaryNavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/secondary_navbar.html',
        replace: false
    };
});

commonDirectives.directive('ckAdminTopNavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/admin_top_navbar.html',
        replace: false,
        scope: {
            user: '='
        }
    };
});

commonDirectives.directive('ckSubnavbar', function () {
    return {
        restrict: 'EA',
        templateUrl: '/templates/subnavbar.html',
        replace: false,
        scope: {
            subNavMenuItems: '=',
            subNavButtons: '='
        },

        controller: ['$scope', function ($scope) {
            $scope.selectItem = selectedItem;
        }]
    };
});

commonDirectives.directive('ckEmployeeCards', function() {
   return {
       restrict: 'A',
       templateUrl: '/templates/employee_card.html',
       replace: true,
       scope: {
           empcard: '='
       }
   }
});

commonDirectives.directive('initFocus', function () {
    var timer;
    return function (scope, elm, attr) {
        if (timer) clearTimeout(timer);

        timer = setTimeout(function () {
            elm.focus();
        }, 0);
    };
});


commonDirectives.directive('fileDropzone', function () {
    return {
        restrict: 'A',
        scope: {
            file: '=',
            fileName: '='
        },
        link: function (scope, element, attrs) {
            var checkSize, isTypeValid, processDragOverOrEnter, validMimeTypes;
            processDragOverOrEnter = function (event) {
                if (event != null) {
                    event.preventDefault();
                }
                event.dataTransfer.effectAllowed = 'copy';
                return false;
            };
            validMimeTypes = attrs.fileDropzone;
            checkSize = function (size) {
                var _ref;
                if (((_ref = attrs.maxFileSize) === (void 0) || _ref === '') || (size / 1024) / 1024 < attrs.maxFileSize) {
                    return true;
                } else {
                    alert("File must be smaller than " + attrs.maxFileSize + " MB");
                    return false;
                }
            };
            isTypeValid = function (type) {
                if ((validMimeTypes === (void 0) || validMimeTypes === '') || validMimeTypes.indexOf(type) > -1) {
                    return true;
                } else {
                    alert("Invalid file type.  File must be one of following types " + validMimeTypes);
                    return false;
                }
            };
            element.bind('dragover', processDragOverOrEnter);
            element.bind('dragenter', processDragOverOrEnter);
            return element.bind('drop', function (event) {
                var file, name, reader, size, type;
                if (event != null) {
                    event.preventDefault();
                }
                reader = new FileReader();
                reader.onload = function (evt) {
                    if (checkSize(size) && isTypeValid(type)) {
                        return scope.$apply(function () {
                            scope.file = evt.target.result;
                            if (angular.isString(scope.fileName)) {
                                return scope.fileName = name;
                            }
                        });
                    }
                };
                file = event.dataTransfer.files[0];
                name = file.name;
                type = file.type;
                size = file.size;
                reader.readAsDataURL(file);
                return false;
            });
        }
    };
});

commonDirectives.directive('checkStrength', function () {
    return {
        replace: false,
        restrict: 'EACM',
        link: function (scope, iElement, iAttrs) {

            var strength = {
                colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                measureStrength: function(pwd) {

                    var floatEntropy;		// Maximum possible combinations of password characters
                    var intBase = 0;		// Total number of characters in the character sets used in the password
                    var intPwdLen;		// length of the password
                    var strUnique = "";		// Sort of unique characters used, I count no more than 2 of each
                    var intUniqueLen = 0;		// Length of "unique" character string, allowing 2 of each character max
                    var intStrength = 0;	// Calculated password strength
                    var x;			// General counter

                    intPwdLen = pwd.length;	// Length of typed password

                    // Entropy space determined by number of possible combinations
                    // of character sets, 26 each for upper an lower case letters,
                    // 10 for digits, 33 for special characters.

                    // Lowercase letters - there are 26 possibilities

                    if (pwd.match(/[a-z]/)) {
                        intBase = intBase + 26;
                    }

                    // Uppercase = 26

                    if (pwd.match(/[A-Z]/)) {
                        intBase = intBase + 26;
                    }

                    // Digits = 10

                    if (pwd.match(/[0-9]/)) {
                        intBase = intBase + 10;
                    }

                    // Special characters = 33

                    if (pwd.match(/[\W_]/)) {
                        intBase = intBase + 33;
                    }

                    // Strip out duplicate bytes (allow 2 only) to avoid passwords like aaaaaaaaaaaaaaaaaa or 123123123123
                    // Don't use regex because special characters mess it up

                    for (x = 0; x < intPwdLen; x++) {
                        var intMatches = 0;
                        for (var i = x + 1; i < intPwdLen; i++) {
                            if (pwd.charAt(x) == pwd.charAt(i))
                                intMatches = intMatches + 1;
                        }
                        if (intMatches < 2)
                            strUnique = strUnique + pwd.charAt(x);
                    }
                    intUniqueLen = strUnique.length;

                    // Entropy for only unique bytes in password

                    floatEntropy = Math.pow(intBase, intUniqueLen);

                    // Calculate pwd strength as the exponent of entropy

                    x = floatEntropy;
                    while (x >= 10) {
                        intStrength = intStrength + 1;
                        x = x / 10;
                    }

                    // Scale from 0 - 50, max strength is 50

                    if (intStrength > 50) intStrength = 50;

                    // Return password strengh

                    console.log('pw-str: '+intStrength);
                    return(intStrength);

                },
                getColor: function (s) {
                    /*
                     return an object with the format:
                     obj = { idx: strengthLevel, col: 'color' }
                     */
                    var idx = 0;
                    if (s <= 5) { idx = 0; }
                    else if (s <= 10) { idx = 1; }
                    else if (s <= 14) { idx = 2; }
                    else if (s <= 18) { idx = 3; }
                    else { idx = 4; }

                    return { idx: idx + 1, col: this.colors[idx] };
                }
            };

            scope.$watch(iAttrs.checkStrength, function () {
                if (typeof(scope.password) !== 'undefined') {
                    var c = strength.getColor(strength.measureStrength(scope.password));
                    iElement.children('li')
                        .css({ "background": "#DDD" })
                        .slice(0, c.idx)
                        .css({ "background": c.col });
                }
            });

        },
        template: ''
    };
});

commonFilters.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});


commonFilters.filter('sumByKey', function () {
    return function (data, key) {
        if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
            return 0;
        }
        var sum = 0;
        for (var i = data.length - 1; i >= 0; i--) {
            sum += parseFloat(data[i][key]);
        }
        return sum;
    };
});

commonFilters.filter('hours', function () {
    return function (input) {
        // format the hours in 8:00 or return appropriate formatting based on fraction of the hour
        return input;
    }
});


//commonDirectives.directive('chDatepicker', function ($scope) {
//    return {
//        restrict: 'E',
//        templateUrl: '/templates/datepicker.html',
//        replace: true,
//        scope: {
//            datepickerPopup: '=',
//            datepickerOptions: '=',
//            dateDisabled: '=',
//            closeText: '='
//        },
//        controller: ['$scope', function ($scope) {
//            $scope.today = function () {
//                $scope.dt = new Date();
//            };
//            $scope.today();
//
//            $scope.showWeeks = true;
//            $scope.toggleWeeks = function () {
//                $scope.showWeeks = !$scope.showWeeks;
//            };
//
//            $scope.clear = function () {
//                $scope.dt = null;
//            };
//
//            // Disable weekend selection
//            $scope.disabled = function (date, mode) {
//                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
//            };
//
//            $scope.toggleMin = function () {
//                $scope.minDate = ( $scope.minDate ) ? null : new Date();
//            };
//            $scope.toggleMin();
//
//            $scope.open = function ($event) {
//                $event.preventDefault();
//                $event.stopPropagation();
//
//                $scope.opened = true;
//            };
//
//            $scope.dateOptions = {
//                'year-format': "'yy'",
//                'starting-day': 1
//            };
//
//            $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
//            $scope.format = $scope.formats[0];
//            }
//        ]
//    }
//    });
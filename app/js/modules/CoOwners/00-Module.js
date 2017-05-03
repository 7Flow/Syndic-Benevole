
_module = angular.module('module.CoOwners');
console.log(_module.name, '=', _module );

//-------------------------------------------------------------------------------------------------------------------//
// CREATES DIRECTIVES
// -> must be done before app bootstrapping (and config)
//-------------------------------------------------------------------------------------------------------------------//
_module.directive('deleteModal', ['$compile', function ($compile) {
    console.log('Directive::deleteModal');

    return {
        restrict: 'C',
        scope: {
            show: '=',
            coOwnerId: '=ngCoownerId'
        },
        replace: true,
        template: JST['app/templates/coowners/deleteModal'],

        link: function ($scope, $element, $attrs) {
            $scope.confirm = function () {
                $scope.$parent.confirmDelete( $scope.coOwnerId );
            };
        }
    };
}]);

_module.directive('updateModal', ['$compile', '$timeout', function ($compile, $timeout) {
    console.log('Directive::updateModal');

    return {
        restrict: 'C',
        scope: {
            show: '=ngShow',
            apartments: '=ngApartments',
            apartSelected: '=ngApartselected',
            coOwnerId: '=ngCoownerid',
            coOwner: '=ngCoowner'
        },
        replace: true,
        template: JST['app/templates/coowners/updateModal'],

        link: function postLink($scope, $element, $attrs) {
            $scope.$watch( "coOwner", function() {
                $element.find('form:first').on('valid.fndtn.abide', function () {
                    var _data = $(this).serializeArray();
                    var _json = {};
                    $.map(_data, function(n, i){
                        _json[n['name']] = n['value'];
                    });
                    $scope.$parent.confirmModify( _json );
                });
            });
        }
    };
}]);

_module.directive('addModal', ['$compile', '$timeout', function ($compile, $timeout) {
    console.log('Directive::addModal');

    return {
        restrict: 'C',
        scope: {
            show: '=',
            apartments: '=ngApartments'
        },
        replace: true,
        template: JST['app/templates/coowners/addModal'],

        link: function($scope, $element, $attrs) {
            setTimeout( function() {
                $element.find('form').on('valid.fndtn.abide', function () {
                    console.log('FORM OK');
                    $scope.$parent.confirmAdd();
                });
            }, 0);
        }
    };
}]);
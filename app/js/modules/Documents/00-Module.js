
_module = angular.module('module.Documents');
console.log(_module.name, '=', _module );

//-------------------------------------------------------------------------------------------------------------------//
// CREATES DIRECTIVES
// -> must be done before app bootstrapping (and config)
//-------------------------------------------------------------------------------------------------------------------//
_module.directive('loadModal', ['$compile', function ($compile) {
    console.log('Directive::loadModal');

    return {
        restrict: 'C',
        scope: {
            show: '='
        },
        replace: true,
        template: JST['app/templates/documents/loadModal'],

        link: function ($scope, $element, $attrs) {
            $scope.confirm = function () {
                //console.log( '-> delete', $scope.coOwnerId );
                $scope.$parent.loadDocument( $scope.coOwnerId );
            };
        }
    };
}]);

_module = angular.module('module.Home');
console.log(_module.name, '=', _module );

//-------------------------------------------------------------------------------------------------------------------//
// EXTENDS BASE CONTROLLERS
// - must be done after app bootstrapping
//-------------------------------------------------------------------------------------------------------------------//
// get Module Controller
// -> controller are not defined at this time (so don't try to get a specific controller)
_ctrl = _module.controller();
// extend controller
_ctrl.extendHomeController = function( $scope, $element, $factory, $injector, $compile, $location ) {
    console.log('--- extend controller: Home ---');

};

_module = angular.module('module.Auth');
console.log(_module.name, '=', _module );

//-------------------------------------------------------------------------------------------------------------------//
// EXTENDS BASE CONTROLLERS
// - must be done after app bootstrapping
//-------------------------------------------------------------------------------------------------------------------//
// get Module Controller
// -> controller are not defined at this time (so don't try to get a specific controller)
_ctrl = _module.controller();
// extend controller
_ctrl.extendLoginController = function( $scope, $element, $factory, $injector, $compile, $location ) {
    console.log('--- extend controller: Login ---');
    console.log($scope);

    $scope.$on('GET', function(event, args) {
        // display login form
        $scope.render( JST['app/templates/auth/login'] );

        setTimeout( function() {
            $element.find('form').on('valid.fndtn.abide', function () {
                var _formData = $element.find('form:first').serialize();

                $factory.post( _formData, function(data) {
                    console.log('AuthController::POST -> LOGIN');
                    if (data.success==true) {
                        // DEFAULT REDIRECT TO HOME
                        if (!targetPage || targetPage == $location.path()) {
                            $location.path('/home');
                        }
                        // ELSE RETURN TO PREVIOUS PAGE
                        else {
                            $location.path( targetPage );
                        }

                        // DISPATCH LOGIN TO APP.CONTROLLER
                        $scope.$parent.$emit('user:login', data.user);

                        targetPage = null;
                    }
                });
            });
        }, 0);
    });
};
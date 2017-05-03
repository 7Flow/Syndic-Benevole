
//-------------------------------------------------------------------------------------------------------------------//
// APP CONTROLLER
//-------------------------------------------------------------------------------------------------------------------//
APP.controller( 'AppController', ['$scope', '$element', '$route', '$compile', '$injector', '$location', 'tmhDynamicLocale',
function($scope, $element, $route, $compile, $injector, $location, tmhDynamicLocale) {
    APP.$scope = $scope;
    // INIT APP LAYOUT
    $element.append( JST['app/templates/layout']() );
    $compile($element.contents())($scope);

    // CURRENT SECTION
    // [String] Controller name (without 'Controller' suffix)
    $scope.currentSection = null;
    $scope.$section = $element.find('.main-section');

    $scope.userLoggedIn = false;

    // NAVIGATION
    $scope.$on(
        "$routeChangeSuccess",
        // ARGS [Object] (equals $route.current)
        // - $$route: contains all param defined in $routeProvider
        // - params:
        // - pathParams:
        function( event, args ) {
            $scope.nextSection = $route.current.$$route.controller;

            console.log( '$routeChangeSuccess', $route.current );

            // FIRST SECTION
            if (!$scope.currentSection) {
                $scope.displaySection();
            }
            // CHANGE SECTION?
            else if ($scope.currentSection != $scope.nextSection) {
                $scope.hideSection();
                $scope.displaySection( $route.current );
            }
            // UPDATE CURRENT SECTION
            else {
                $scope.updateSection( $route.current );
            }
        }
    );

    $scope.displaySection = function() {
        console.log("[AppCtrl]:displaySection");

        if (!$route.current.$$route.module) {
            console.warn("missing module on $route: ");
            console.log($route.current);
            return;
        }

        // MUST SET CONTROLLER BEFORE COMILING
        var _tpl = JST['app/templates/abstractModuleLayout']();
        _tpl = _tpl.replace(/{{controller}}/g, $route.current.$$route.controller+'Controller');
        _tpl = _tpl.replace(/{{module}}/g, $route.current.$$route.module);
        $scope.$section.html( _tpl );

        // ADD CONTROLLER LAYOUT
        var _tplFunc = JST['app/templates/'+ $route.current.$$route.module.toLowerCase() +'/layout'];
        if (_tplFunc) {
            _tpl = _tplFunc();
            $scope.$section.find('.sub-section:first').append(_tpl);
        }

        // SET CURRENT SECTION BEFORE ANGULAR MAGIC HAPPENS
        // - Controller need to know the currentSection
        $scope.currentSection = $scope.nextSection;
        $scope.nextSection = null;

        // COMPILE MODULE LAYOUT
        // - will instanciate controller
        $compile($scope.$section)($scope);

        // CALL ACTION
        // - controller listen to this event
        // - if config is defined, default action is GET
        if (module.exports.api[$route.current.$$route.module]) {
            $scope.$root.$broadcast('GET', {
                $route:     $route.current,
                template:   module.exports.api[$route.current.$$route.module][$route.current.$$route.controller].template
            });
        }
    };
    $scope.hideSection = function() {
        $scope.$section.empty();
        // SUBSECTION IS THE FIRST CHILD... for now actually. tricky delete
        $scope.$$childHead.$destroy();
    };
    $scope.updateSection = function( $$route ) {
        $scope.$root.$broadcast('GET', {
            $route:     $route.current,
            template:   module.exports.api[$route.current.$$route.module][$route.current.$$route.controller].template
        });
    };

    // LOCALISATION
    $scope.changeLanguage = function (key) {
        // change $locale
        tmhDynamicLocale.set(key);
        $route.reload(false);
    };

    // LOGIN
    $scope.$on('user:login', function( event, data ) {
        console.log('[App]:Login');
        $scope.userLoggedIn = true;
        $scope.user = data;
        console.log( $scope.user );
        $element.find('.right-small').addClass('active');

        // INIT DROPDOWN FOUNDATION
        setTimeout( function() {
            $('.tab-bar > .right-small').foundation();
        }, 50);
    });
    $scope.logout = function() {
        $scope.user = null;
        $scope.userLoggedIn = false;
        // -> response by 401 if success (no _factory callback due to interceptors)
        var _factory = $injector.get('LoginFactory');
        _factory.delete({}, function(data, status, headers, config) {
        });
    };
    $scope.view = function( id ) {
        console.log( 'CURRENT USER: ', id );
        $location.path('/coowners/'+$scope.user.id);
    };

    // INIT FOUNDATION
    // custom modal reveal animation
    var _fndtnOpenCb = function() {
        console.log('[FoundationReveal] ::openCallback');
        setTimeout( function() {
            var modal = $(this);
            modal.addClass('open');
        }, 0);
    };

    setTimeout( function() {
        $(document).foundation();
        $(document).foundation('reveal', {animation: 'fade', open: _fndtnOpenCb});
    }, 0);

    // - event name change in Foundation5???
    //$(document).on('open.fndtn.reveal', '[data-reveal]', _fndtnOpenCb);
}]);

// ROUTE CONFIG
APP.config(['$routeProvider', '$compileProvider', '$controllerProvider', '$logProvider', 'tmhDynamicLocaleProvider', function($routeProvider, $compileProvider, $controllerProvider, $logProvider, tmhDynamicLocaleProvider) {

    // LOCALISATION
    tmhDynamicLocaleProvider.localeLocationPattern('app/vendor/i18n/angular-locale_{{locale}}.js');

    // API
    angular.forEach( module.exports.api, function(services, name) {

        angular.forEach( services, function( _service, _name) {
            console.log(_name + ' :: ' + _service.path );

            $routeProvider.when(_service.path, {
                module: name,
                controller: _name,
                action: 'GET',
                template: JST[_service.template]
            });
        });
    });

    $routeProvider.when('/', {
        module: 'Auth',
        controller: 'Login'
    });

    $logProvider.debugEnabled(true);
    $COMPILER = $compileProvider;
    $CONTROLLER = $controllerProvider;

}]);

angular.bootstrap(document, [_appName]);
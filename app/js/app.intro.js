'use strict';

//var _appName = $('html').attr('ng-app');
var _appName = "eSyndic";

// SERVER CONFIG
//--------------
// Server API run on :8080
// HTTP Express run on :7777
// MySQL run on :8889
// Redis run on :6379

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

//-------------------------------------------------------------------------------------------------------------------//
// UTILS
var assertDirectives = function($injector, directives) {
    for (var i = 0, _l = directives.length; i < _l; ++i) {
        var _dir = directives[i];
        if (!$injector.has(_dir + 'Directive'))
            throw("Directive " + _dir + " is not available.")
    }
};

//-------------------------------------------------------------------------------------------------------------------//
// APP DEPS
var _deps = [
    'ngResource',
    'ngRoute',
    'ngCookies',
    'tmh.dynamicLocale'
];
var _baseRoute = module.exports.domain + ':' + module.exports.port + module.exports.prefix;

//-------------------------------------------------------------------------------------------------------------------//
// CONTROLLER & MODEL CONFIG
function extendController( module, controller, $scope, $element, $factory, $injector, $compile, $location ) {
    console.log( 'Extend Controller:', module, controller );
    var _ctrl = module.controller( controller );
    //if (!_ctrl.extended) {
        //console.log( 'DIFFERENCE BETWEEN CTRL & $SCOPE:' );
        //console.log( 'CTRL:', _ctrl);
        //console.log( '$SCOPE:', $scope);
        if (_ctrl['extend'+controller]) {
            _ctrl['extend'+controller]($scope, $element, $factory, $injector, $compile, $location);
        }
        _ctrl.extended = true;
    //}
};

angular.forEach( module.exports.api, function(services, name) {
    _deps.push( 'module.'+name );
    // CREATE MODULE
    console.log( '--- create module: '+name+' ---' );
    var _module = angular.module( 'module.'+name, []);

    angular.forEach( services, function(_service, ctrlName) {
        // FACTORY
        _module.factory(ctrlName+'Factory', ['$resource', function ($resource) {
            var _actions = {};

            for (var j = 0, __l = _service.methods.length; j < __l; ++j) {
                var _method = _service.methods[j];
                _actions[ module.exports.angular[_method] ] = {
                    method: _service.methods[j],
                    isArray: false
                };
                //console.log( _actions );
            }
            return $resource(_baseRoute + _service.path, null, _actions);
        }]);

        // CONTROLLER
        var _ctrlName = ctrlName+'Controller';
        console.log('    --- set controller: '+_ctrlName+' ---');
        // - built 'on-the-fly': local var will be always equal to the last value!
        _module.controller(_ctrlName, ['$scope', '$element', ctrlName+'Factory', '$injector', '$compile', '$location', function ($scope, $element, Factory, $injector, $compile, $location) {
            var __ctrlName = $scope.$parent.currentSection + 'Controller';
            console.log('-- construct: '+__ctrlName+' --');

            //$http.defaults.headers.post.Cookies = $cookie;

            // RESTFUL METHODS
            // - action is broadcast by AppController
            // EXECUTE GENERIC METHOD
            $scope.execute = function( event, args ) {
                var _method = module.exports.angular[event.name];
                console.log("[Module-"+__ctrlName+"]::execute "+_method );
                // ARGS [Object]:
                // - $route: the current route
                // - template: JST Function
                Factory[_method]( args.$route.pathParams, function(data, status, headers, config) {
                    // WebService response always:
                    // - have an "authorization" Object
                    // - have a "data" object (result of the query)
                    // - Angular params (first character '$')
                    // - Angular method 'toJSON'
                    // but could have more specific parameters
                    for (var _param in data) {
                        if (_param.charAt(0)!='$' && _param!='toJSON') {
                            $scope[_param] = data[_param];
                        }
                    }

                    console.log('Factory::'+_method);

                    // call specific callback
                    // - to override to have specific control on each method
                    // - useful to pre-process data before rendering
                    var _cb = $scope[_method+'Callback'];
                    if (_cb) _cb();

                    $scope.render( args.$route.template );
                });
            };

            $scope.render = function( tpl ) {
                console.log("[Module-"+__ctrlName+"]::render ");
                var _tpl = tpl(),
                    _$view = $element.find('.sub-section');

                _$view.html( _tpl );
                $compile(_$view)($scope);

                //assertDirectives( $injector, ['deleteModal'] );

                // UPDATE FOUNDATION
                setTimeout( function() {
                    _$view.foundation();

                    // UPDATE: must use promise $q!
                    var _cb = $scope['renderCallback'];
                    if (_cb) _cb();
                }, 0);
            };

            // LISTEN
            for (var j = 0, __l = _service.methods.length; j < __l; ++j) {
                var _method = _service.methods[j];
                console.log(_method);
                $scope.$on(_method, $scope.execute);
            }

            extendController( _module, __ctrlName, $scope, $element, Factory, $injector, $compile, $location );
        }]);
    });
});

//-------------------------------------------------------------------------------------------------------------------//
// BUILD APP
//-------------------------------------------------------------------------------------------------------------------//
var APP = angular.module(_appName, _deps);
var $COMPILER = null;
var $CONTROLLER = null;
var targetPage = null;

APP.factory('httpInterceptor', ['$q', '$location', '$cookies', function($q, $location, $cookies) {
    var _apiToken = null;

    var requestInterceptor = {
        // INJECT TOKEN KEY
        request: function(config) {
            console.log('[HttpInterceptor]::Request');
            //console.log(config);

            // CHECK HEADER: active session
            if (_apiToken) config.headers['Authorization'] = _apiToken;
            // CHECK COOKIE: get old session (still active?)
            else if ($cookies.eSyndic) {
                // don't set _apiToken: ask server if it still active
                // -> check response instead
                //_apiToken = $cookies.eSyndic;
                config.headers['Authorization'] = $cookies.eSyndic;
            }
            return config;
        },
        // GET RESPONSE SERVER
        // -> check status (look for 401)
        // -> check for redirect
        response: function(response) {
            console.log('[HttpInterceptor]::Response');
            //console.log( response );
            // ANGULAR SEEMS TO WRAP ONLY DEFAULT HEADERS
            // -> check response.config.headers instead of response.headers
            var _responseToken = response.headers('Authorization');
            console.log( _responseToken, _apiToken );

            if (_responseToken) {
                // RETREIVE OLD SESSION
                //console.log('cookie session still active');
                // -> still override
                $cookies.eSyndic = _responseToken;
                if(!_apiToken) {
                    // dispatch login
                    APP.$scope.$emit('user:login', $cookies.eSyndic);
                }
                // update session
                _apiToken = _responseToken;
            }

            if (response.data.redirect) {
                // ANGULR REDIRECT
                $location.path( response.data.redirect );
            } else if (response.status==401) {
                $location.path( '/login' );
            }
            return response;
        },
        responseError: function(rejection) {
            if (rejection.status === 401) {
                console.log("Response Error 401",rejection);

                // destroy session
                $cookies.eSyndic = _apiToken = null;

                targetPage = $location.path();
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    };
    return requestInterceptor;
}]);

APP.config(['$httpProvider', function($httpProvider) {
    $httpProvider.interceptors.push( 'httpInterceptor' );
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
}]);

// PREPARE FOR EXTEND
var _module, _ctrl;
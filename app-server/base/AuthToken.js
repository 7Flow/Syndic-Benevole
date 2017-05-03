var redis       = require('redis'),
    client      = redis.createClient(),
    _authorization = require('../config/authorization');

var AuthToken = {
    role: null,

    create: function( user, res ) {
        // create unique api token for user
        var _token = 'api-key-'+user.lastName+(Date.now());
        // redis store
        client.hset(_token, 'login', user.login, redis.print);
        client.hset(_token, 'role', user.role, redis.print );
        client.expire( _token, 3600 );

        AuthToken.role = user.role;

        // -> add headers (find a best way?)
        res._headers['authorization'] = _token;
        res._headerNames['authorization'] = 'Authorization';
    },

    delete: function( req, res ) {
        var _token = req.headers.authorization;

        AuthToken.role = null;

        if (_token) {
            client.del(_token, function() {
                res.status( 401 )
                   .json({success: "session ended"} )
                   .end();
            });
        } else {
            res.status( 401 )
               .json( {error: "no active session"} )
               .end();
        }
    },

    checkRequest: function(req, res, next) {
        console.log('[AuthToken] ::checkRequest '+req.originalUrl);
        var _url = req.url;

        if (_url.indexOf('login')==-1 && req.method!='OPTIONS') {

            var _token = req.headers.authorization;
            //console.log( req.session );

            if (_token) {
                console.log('-> verify token ' + _token);

                // CHECK IF USER IS LOGGED IN
                client.exists(_token, function(error, status) {
                    if (status) {
                        client.hget(_token, 'role', function(error, value) {
                            // -> update role at each request
                            AuthToken.role = value;
                            // -> add headers (find a best way?)
                            res._headers['authorization'] = _token;
                            res._headerNames['authorization'] = 'Authorization';
                            next();
                        });
                    } else {
                        AuthToken.fail(res);
                    }
                });
            } else {
                AuthToken.fail(res);
            }
        } else {
            next();
        }
    },

    // CHECK IF USER IS ALLOWED TO PERFORM THIS OPERATION
    verifyAuthorization: function( req, res ) {
        if (_authorization.verify(AuthToken.role, req.route.path, req.method)) {
            return true;
        } else {
            AuthToken.denied(res);
            return false;
        }
    },

    fail: function( res ) {
        res.status( 401 )
           .json({error: "need authentication"})
           .end();
    },
    denied: function( res ) {
        res.status( 403 )
            .json({error: "need authorization"})
            .end();
    }
};

module.exports = AuthToken;
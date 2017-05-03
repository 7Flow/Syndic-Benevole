var _db         = require("../connect"),
    _abstract   = require('./AbstractController'),

    // check out https://github.com/visionmedia/node-pwd
    password = require('pwd'),

    authToken = require('../base/AuthToken'),

    MysqlRequest = require('../base/MysqlRequest');


//var Auth = _extend( {}, _abstract );
var Auth = Object.create( _abstract, {TABLE: {value: 'coowners', enumerable: true}} );

Auth.SALT = 'choubidou';

// L O G I N
// - overrides
// - no authorizations required
Auth.METHOD = function(req, res) {
    this[req.method]( req, res );
};
Auth.POST = function(req, res) {
    //console.log('Auth::POST ', req.body.login, req.body.password);

    var _this = this;

    // REGENERATE HASH
    password.hash( req.body.password, Auth.SALT, function(err, hash) {
        // GET EXISTING USER WITH THIS LOGIN
        var _request = new MysqlRequest().select()
                                         .values(['id', 'name', 'lastName', 'role', 'fk_apartment_id', 'apartment_lot', 'apartment_ten_thousand'])
                                         .from( _this.TABLE )
                                         .leftJoin( 'apartment', _this.TABLE+'.fk_apartment_id', 'apartment.apartment_id' )
                                         .where('login', req.body.login)
                                         .where('password', hash)
                                         .end();

        Auth.query( _request, req, res, Auth.onSuccess );
    });
};
Auth.DELETE = function( req, res ) {
    authToken.delete( req, res );
};

Auth.onSuccess = function(results, res, req) {
    console.log( '[Auth]:onSuccess' );
    console.log( results );

    if (results.data.length>0) {
        var user = results.data[0];

        console.log('[API] Auth::success');

        // GENERATE TOKEN
        authToken.create( user, res );

        // update session
        if (req.session) {
            for (var _param in user) {
                req.session['user_'+_param] = user[_param];
            }
        }

        res.json( {success: true, user: user} )
           .end();
    } else {
        console.log('Auth::error');

        // NO SERVER REDIRECTION: done in front
        // -> respond 401
        authToken.fail( res );
    }
};

module.exports = Auth;
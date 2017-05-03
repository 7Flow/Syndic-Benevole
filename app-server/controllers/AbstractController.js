var _db = require("../connect"),
    MysqlRequest = require('../base/MysqlRequest'),
    Auth = require('../base/AuthToken'),
    _authorization = require('../config/authorization');


/**
 * Standard controller for an API route
 *
 * - response object of the API :
 * {
 *     data: {
 *         ...
 *     },
 *     authorization: {
 *         GET: true,
 *         ...
 *     }
 * }
 *
 * @type {{TABLE: string, DB: string, queryCallback: null, query: query, errorCallback: errorCallback, successCallback: successCallback, response: response, METHOD: METHOD, GET: GET, POST: POST, PUT: PUT, DELETE: DELETE, setFinalCallback: setFinalCallback}}
 */
var AbstractController = {
    TABLE: '',
    DB: 'esyndic',

    /**
     * successCallback [Function]
     * - used to chain request (if a controller need data from another, and merge it into a single user request's response
     */
    queryCallback: null,

    /**
     *
     */
    originalReq: null,

    /**
     * Base route. Dynamically set by server, when creating all API controller.
     * @see api.js
     * @see server.js
     */
    basePath: "",

    /*
     * Execute a SQL request
     * For simple get method, you better should usee shortcut method instead (GET).
     *
     * @param type      {string} SELECT | INSERT | UPDATE | DELETE
     * @param request   {Object}
     *      - base      {string} request action
     *      - params    {Object} request params
     *      - options   {string} request options (that will be appended to the request), like 'GROUP' or 'ORDER'
     * @param req       {Object} Usually a full Express Request object, or a custom copy, with only theses parameters:
     *      - originalUrl {string}
     *      - params    {Object}
     * @param res       {Object} response
     * @param processCallback [Function] -optional- success callback, if data needs to be processed. Could be different from the finalCallback, set ine method shortcut.
     * @param errorCallback [Function] -optional- error callback, in addition of the default 'errorCallback' method.
     */
    query: function( request, req, res, processCallback, errorCallback ) {
        //console.log('[AbstractController] '+this.TABLE+'::query');

        var _this = this;

        _db.getConnection( function(err, connection) {
            connection.query( request.sql, request.params, function (err, rows) {
                if (err) {
                    if (errorCallback) errorCallback( err );
                    // always throw error
                    _this.errorCallback( err );
                    if (res) res.end();
                } else {
                    // inject authorization
                    var _results = {
                        authorization: _this.getAuthorization(req),
                        data: rows
                    };

                    if (processCallback) {
                        processCallback( _results, res, req );
                    } else {
                        _this.response.call( _this, _results, res, req );
                    }
                }
            });
            connection.release();
        });
    },

    // default error callback
    errorCallback: function( error ) {
        this.queryCallback = null;
        throw error;
    },

    /**
     * Respond to the request.
     * If no callback was defined, end the request and return results as json
     * Else, callback
     * @param results
     * @param res
     * @param req
     *
     * @see AbstractController.successCallback
     */
    response: function( results, res, req ) {
        console.log('[AbstractController] '+this.TABLE+'::response');

        if (this.queryCallback && this.queryCallback.name != "next") {
            var _originalReq = this.originalReq ? this.originalReq : req;

            this.queryCallback( results, res, _originalReq );
            // Don't null the callback here
            // -> if you call this service in a loop, you want each response on the same callback
            // this.queryCallback = null;
            // this.originalReq = null;
        }
        else {
            console.log(' => '+this.TABLE+' end request');
            res.json( results )
               .end();
        }
    },

    /**
     * methods automatically linked to express Router
     * -> you can override this method, to pass process data callback different from final result callback
     * @param req {object} Express Request object
     * @param res {object} Express Response object
     * @param callback {function}
     * @constructor
     * @see server.js
     */
    METHOD: function(req, res, callback) {
        //console.log('[AbstractController] '+this.TABLE+'::METHOD');
        if (Auth.verifyAuthorization( req, res )) {
            this[req.method]( req, res, callback );
        }
    },

    GET: function(req, res, callback) {
        this.setFinalCallback( callback );
        var _request = new MysqlRequest().select()
            .values()
            .from(this.TABLE);

        if (req.params) {
            _request.where( req.params );
        }
        _request.end();

        this.query(_request, req, res);
    },

    POST: function(req, res, callback) {
        this.setFinalCallback( callback );
        var _request = new MysqlRequest().insert(this.DB, this.TABLE)
            .insertValues(req.body)
            .end();
        this.query(_request, req, res);
    },

    PUT: function(req, res, callback) {
        this.setFinalCallback( callback );
        var _request = new MysqlRequest().update(this.DB, this.TABLE)
            .set( req.body )
            .where( "id", req.body.id )
            .end();
        this.query(_request, req, res);
    },

    DELETE: function(req, res, callback) {
        this.setFinalCallback( callback );
        var _request = new MysqlRequest().delete()
            .from(this.TABLE)
            .where(req.params)
            .end();
        this.query(_request, req, res);
    },

    setFinalCallback: function( successCallback ) {
        if (successCallback) {
            this.queryCallback = successCallback;
        }  else {
            this.queryCallback = null;
        }
    },

    getAuthorization: function( req ) {
        var _originalUrl = req.originalUrl;
        if (!_originalUrl) {
            // sub-object in req
            _originalUrl = req.req.originalUrl;
        }

        if ( _originalUrl.indexOf(this.basePath) > -1 ) {
            return _authorization.get( Auth.role, _originalUrl );
        } else {
            return _authorization.get( Auth.role, this.basePath );
        }
    }
};

module.exports = AbstractController;
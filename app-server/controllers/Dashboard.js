var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest'),
    Budget = require('./Budget'),
    Discussions = require('./Discussions'),
    Documents = require('./Documents'),
    Payment = require('./Payment');

/**
 * Meta controller: one request to this controller will make several request to aggregate all data concerning current owner
 *
 * - WARNING -
 * The authorization injected on all data will be for request route, so for /dashboard (not /budget or /document)
 *
 * @type {connect|exports}
 * @private
 */
var Dashboard = Object.create( _abstract, {TABLE: {value: 'dashboard', enumerable: true}} );

Dashboard.GET = function(req, res, callback) {
    this.setFinalCallback( callback );

    this.waitingFor = 3;
    this.datas = {};
    // default dashboard:
    // - simple overview of the current budget
    // -> if no params, inject current year as param
    if ( !req.params.hasOwnProperty('budget_year') ) {
        var _year = new Date().getFullYear();
        req.params = {
            budget_year: _year
        };
    }

    Budget.GET(req, res, this.budgetCallback.bind(this) );

    //req.params = {id: req.session.user_id};
    req.params = null;
    // - last discussion
    Discussions.GET(req, res, this.discussionsCallback.bind(this) );
    // - last documents
    Documents.GET(req, res, this.documentsCallback.bind(this) );
};

Dashboard.budgetCallback = function( data, res, req ) {
    //console.log('[Dashboard]:budgetCallback');
    this.datas.budget = data;

    this.founds = data.data.length;
    this.foundGet = 0;

    for (var i=0, l=this.founds; i<l; ++i) {
        // - status of coowner payments for each current budget founds
        var _req = {
            originalUrl: req.originalUrl,
            params: {
                fk_apartment_id: req.session.user_fk_apartment_id,
                fk_found_id: data.data[i].found_id
            }
        };
        Payment.GET(_req, res, this.paymentsCallback.bind(this) );
    }
};

Dashboard.discussionsCallback = function( data, res, req ) {
    this.datas.discussions = data;
    this.onCallback(res, req);
};

Dashboard.documentsCallback = function( data, res, req ) {
    this.datas.documents = data;
    this.onCallback(res, req);
};

Dashboard.chargesCallback = function( data, res, req ) {
    this.datas.charges = data;
    this.onCallback(res, req);
};

Dashboard.paymentsCallback = function( data, res, req ) {
    ++this.foundGet;

    // inject payments into found's budget
    for (var i=0, l=this.founds; i<l; ++i) {
        var _found = this.datas.budget.data[i];
        if ( _found.found_id == data.data.fk_found_id ) {
            _found.payments = data;
        }
    }

    if (this.foundGet == this.founds) {
        this.onCallback(res, req);
    }
};

Dashboard.onCallback = function( res, req ) {
    --this.waitingFor;

    console.log( this.waitingFor );

    if (this.waitingFor == 0) {
        this.response( this.datas, res, req );
    }
};

module.exports = Dashboard;
var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest'),
    Found = require('./Found');


var Budget = Object.create( _abstract, {TABLE: {value: 'budget', enumerable: true}} );

Budget.GET = function(req, res, callback) {
    console.log('[Budget] ::GET');
    console.log( req.params );

    this.needDetails = req.originalUrl.indexOf('budget') > -1;

    if (callback && callback.name == 'next') {
        console.log( this.needDetails );
        this.needDetails = true;
    }

    this.setFinalCallback( callback );

    // get all founds (typically the charge, and other custom found) of the year
    var _request = new MysqlRequest().select()
        .values()
        .from( this.TABLE )
        .leftJoin( 'found', this.TABLE+'.budget_id', 'found.fk_budget_id' )
        .where( req.params )
        .whereNotNull( 'found.found_name' )
        .end();

    this.query( _request, req, res, this.getCallback.bind(this) );
};

/**
 * Data control:
 * - if found is of type 'charges', and amount is NULL, calculate the amount according to its expenditures
 *
 * @param rows
 * @param res
 * @param req
 * @param successCallback
 */
Budget.getCallback = function( results, res, req, successCallback ) {

    console.log('[Budget]: internal cb');

    this.foundToCount = results.data.length;
    // store intermediate data
    this.datas = results;
    this.originalReq = req;

    for (var i = 0, l = results.data.length; i < l; ++i) {
        var _found = results.data[i];
        var _req = {
            originalUrl: req.originalUrl,
            params: {
                found_id: _found.found_id
            }
        };
        Found.GET( _req, res, this.foundCallback.bind(this) );
    }

    // if no found associate with this budget, send the response
    if (!this.foundToCount) {
        this.response( results, res, req, successCallback );
    }
};

Budget.foundCallback = function( results, res, req, successCallback ) {
    --this.foundToCount;
    var _foundId = results.found_id;

    // -> only inject total
    for (var i = 0, l = this.datas.data.length; i < l; ++i) {
        if (_foundId == this.datas.data[i].found_id) {

            var _found = this.datas.data[i];
            _found.found_amount = results.total;

            // detailed budget: inject all expenditures data
            if (results.data.length && this.needDetails) {
                _found.expenditures = results.data;
            }

            this.datas.data[i] = {
                authorization: results.authorization,
                data: _found
            }
        }
    }

    // if all founds are done, send the response
    if (!this.foundToCount) {
        this.response( this.datas, res, req, successCallback );
    }
};

module.exports = Budget;
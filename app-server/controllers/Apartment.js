var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest');


var Apartment = Object.create( _abstract, {TABLE: {value: 'apartment', enumerable: true}} );

Apartment.GET = function(req, res, callback) {
    console.log('[Apartment] ::GET');
    this.setFinalCallback( callback );

    var _request = new MysqlRequest().select()
        .values()
        .from( this.TABLE )
        .leftJoin('coowners', this.TABLE+'.apartment_id', 'coowners.fk_apartment_id' )
        .whereNotNull( 'coowners.name' )
        .orderBy( 'apartment_lot', 'ASC' )
        .end();

    this.query( _request, req, res, this.getProcess.bind(this) );
};
// GET success callback
Apartment.getProcess = function( results, res, req ) {
    console.log('[Apartment] ::getProcess');

    var _rows = results.data,
        _lots = {},
        _apartments = [],
        _l = _rows.length,
        i = 0;

    for (i; i<_l; ++i) {
        var _apart = _rows[i];
        // if new lot: create result line
        if (_lots[_apart.apartment_lot] == undefined) {
            _lots[_apart.apartment_lot] = _apartments.length;
            _apartments.push( {
                id: _apart.apartment_id,
                lot: _apart.apartment_lot,
                ten_thousand: _apart.apartment_ten_thousand,
                address: _apart.apartment_address,
                street: _apart.apartment_street,
                coowners: _apart.lastName
            } );
        }
        // else: add coowners lastName to the coowners
        else {
            _apartments[ _lots[_apart.apartment_lot] ].coowners += ' / '+_apart.lastName;
        }
    }

    // override data
    results.data = _apartments;

    // SEND RESPONSE
    this.response( results, res, req );
};

module.exports = Apartment;
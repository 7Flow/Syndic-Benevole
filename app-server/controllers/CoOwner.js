var _db = require("../connect");
var _abstract = require('./AbstractController');
var _extend = require('util')._extend;

var MysqlRequest = require('../base/MysqlRequest');


var CoOwner = Object.create( _abstract, {TABLE: {value: 'coowner', enumerable: true}} );

CoOwner.GET = function(req, res, callback) {
    //console.log('[CoOwner]::GET');
    //console.log( req.params );
    this.setFinalCallback( callback );

    // specify table for values, avoid ER_NON_UNIQ_ERROR on 'id'
    // -> fixed with prefixed foreign key (fk_)
    var _request = new MysqlRequest().select()
        .values([this.TABLE+'.id', this.TABLE+'.name', this.TABLE+'.lastName', this.TABLE+'.fk_apartment_id', this.TABLE+'.email', this.TABLE+'.role'])
        .from( this.TABLE )
        .leftJoin('apartment', this.TABLE+'.fk_apartment_id', 'apartment.apartment_id');

    if (Object.keys(req.params).length != 0) {
        _request.where(req.params);
    }

    _request.orderBy( this.TABLE+'.fk_apartment_id', 'ASC' )
        .end();

    this.query( _request, req, res, callback );
};

module.exports = CoOwner;
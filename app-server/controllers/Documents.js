var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest'),

    Apartment = require('./Apartment');


var Documents = Object.create( _abstract, {TABLE: {value: 'documents', enumerable: true}} );

Documents.GET = function(req, res, callback) {
    this.setFinalCallback( callback );

    var _request = new MysqlRequest().select()
        .values()
        .from( this.TABLE )
        .end();

    this.query( _request, req, res, this.getCallback.bind(this) );
};

// GET APARTMENT'S LOT
Documents.getCallback = function( data, res, req ) {
    console.log('[Documents] ::getCallback');
    console.log( data );

    this.tmpData = data;
    Apartment.GET( req, res, this.getCompleteCallback.bind(this) );
};

Documents.getCompleteCallback = function( data, res, req ) {
    console.log('[Documents] ::getCompleteCallback');

    data.apartments = data.data;
    data.data = this.tmpData;

    this.response( data, res, req );
};

module.exports = Documents;
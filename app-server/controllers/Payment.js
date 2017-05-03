var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest');


var Payments = Object.create( _abstract, {TABLE: {value: 'payment', enumerable: true}} );

module.exports = Payments;
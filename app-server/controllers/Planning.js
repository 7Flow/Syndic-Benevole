var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest');


var Planning = Object.create( _abstract, {TABLE: {value: 'planning', enumerable: true}} );

module.exports = Planning;
var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest');


var Discussions = Object.create( _abstract, {TABLE: {value: 'discussions', enumerable: true}} );


module.exports = Discussions;
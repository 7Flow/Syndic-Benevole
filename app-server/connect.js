var mysql = require('mysql');
var dbConfig = {
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "esyndic"
};

var connect = {
    pool: null,
    createPool: function() {
        connect.pool = mysql.createPool(
            dbConfig
        );
    },
    getConnection: function( cb ) {
        if (!connect.pool) connect.createPool();
        return connect.pool.getConnection(cb);
    }
};

module.exports = connect;

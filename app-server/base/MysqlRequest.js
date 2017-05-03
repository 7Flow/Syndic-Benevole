function MysqlRequest() {
    this.sql = '';
    this.params = [];
}
MysqlRequest.prototype = {
    sql: '',
    params: [],

    _firstParam: true,
    _firstOn: true,
    _firstOrder: true,
    _table: null,

    select: function() {
        this.sql = 'SELECT';
        return this;
    },
    delete: function() {
        this.sql = 'DELETE';
        return this;
    },
    update: function( db, table ) {
        this.sql = 'UPDATE '+db+'.'+table;
        this._table = table;
        return this;
    },
    insert: function( db, table ) {
        this.sql = 'INSERT INTO '+db+'.'+table;
        this._table = table;
        return this;
    },

    from: function( table, alias ) {
        this.sql += ' FROM '+table;
        if (alias) {
            this.sql += ' '+alias;
        }
        this._table = table;
        return this;
    },

    where: function( key, value) {
        if (typeof key == 'object' ) {
            for (var k in key) {
                this.addWhereParam();
                this.sql += this._table+'.'+k + ' = ?';
                this.params.push(key[k]);
            }
        } else {
            this.addWhereParam();
            this.sql += this._table+'.'+key+' = ?';
            this.params.push(value);
        }
        return this;
    },
    or: function( key, value ) {
        this.sql += ' OR '+key+' = ?';
        this.params.push( value );
        return this;
    },
    whereNotNull: function( key ) {
        this.addWhereParam();
        this.sql += key + ' IS NOT NULL';
        return this;
    },
    whereNull: function( key ) {
        this.addWhereParam();
        this.sql += key + ' IS NULL';
        return this;
    },

    /*
     * @params [Object] json
     */
    set: function( obj ) {
        this.sql += ' SET';
        for (var key in obj) {
            if (obj[key]) {
                this.sql += ' ' + this._table +'.'+ key + ' = "' + obj[key] + '",';
            }
        }
        this.sql = this.sql.slice(0, -1);
        return this;
    },

    /*
     * @params [Array]
     */
    values: function( params ) {
        if (!params) {
            this.sql += ' *';
        } else {
            var _l = params.length,
                i = 0;
            for (i; i<_l; ++i) {
                if (this._firstParam) {
                    this.sql += ' ';
                    this._firstParam = false;
                }
                this.sql += params[i]+', ';
            }
            this.sql = this.sql.slice(0, -2);
            this._firstParam = true;
        }
        return this;
    },

    /*
     * @params [Object]
     */
    insertValues: function( params ) {
        for (var key in params) {
            if (this._firstParam) {
                this.sql += ' (';
                this._firstParam = false;
            }
            this.sql += key+', ';
            this.params.push( params[key] );
        }
        this.sql = this.sql.slice(0, -2) + ')';

        this.sql += ' VALUES (';

        for (var key in this.params) {
            this.sql += '?, ';
        }
        this.sql = this.sql.slice(0, -2) + ')';
        this._firstParam = true;
        return this;
    },

    groupBy: function( key ) {
        this.sql += ' GROUP BY '+key;
        return this;
    },
    orderBy: function( key, ordered ) {
        if (this._firstOrder) {
            this._firstOrder = false;
            this.sql += ' ORDER BY ' + key;
        } else {
            this.sql += ', '+key;
        }
        if (ordered) {
            this.sql += ' '+ordered;
        }
        return this;
    },

    leftJoin: function( otherTable, key, otherKey ) {
        this._firstOn = this._firstOrder = true;
        this.sql += ' LEFT JOIN '+otherTable;
        if (key) {
            this.on(key, otherKey);
        }
        return this;
    },
    rightJoin: function( otherTable, key, otherKey ) {
        this._firstOn = this._firstOrder = true;
        this.sql += ' RIGHT JOIN '+otherTable;
        if (key) {
            this.on(key, otherKey);
        }
        return this;
    },
    innerJoin: function( otherTable, key, otherKey ) {
        this._firstOn = this._firstOrder = true;
        this.sql += ' INNER JOIN '+otherTable;
        if (key) {
            this.on(key, otherKey);
        }
        return this;
    },
    on: function( key, otherKey ) {
        if (this._firstOn) {
            this._firstOn = false;
            this.sql += ' ON '+key+' = '+otherKey;
        } else {
            this.sql += ' AND '+key+' = '+otherKey;
        }
        return this;
    },

    end: function() {
        this.sql += ';';
        return this;
    },

    toString: function() {
        return this.sql;
    },

    /**
     * helper for where
     */
    addWhereParam: function() {
        if (this._firstParam) {
            this.sql += ' WHERE ';
            this._firstParam = false;
        } else {
            this.sql += ' AND ';
        }
    }
};

module.exports = MysqlRequest;
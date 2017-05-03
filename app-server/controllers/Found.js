var _db = require("../connect"),
    _abstract = require('./AbstractController'),
    MysqlRequest = require('../base/MysqlRequest');


var Found = Object.create( _abstract, {TABLE: {value: 'found', enumerable: true}} );

Found.GET = function(req, res, callback) {
    console.log('[Found] ::GET');
    console.log( req.params );

    this.setFinalCallback( callback );

    if (req.params.hasOwnProperty('found_name')) {
        // GET found's evolution over years
        // -> get all budget's found, to filter to budget name
        var _request = new MysqlRequest().select()
            .values()
            .from( this.TABLE )
            .leftJoin( 'budget', this.TABLE+'.fk_budget_id', 'budget.budget_id' )
            .leftJoin( 'j_found_expenditure', this.TABLE+'.found_id', 'j_found_expenditure.fk_found_id' )
            .leftJoin( 'expenditure', 'j_found_expenditure.fk_expenditure_id', 'expenditure.expenditure_id' )
            .leftJoin( 'provider', 'expenditure.fk_provider_id', 'provider.provider_id' )
            .where( req.params )
            .whereNotNull( 'expenditure.expenditure_name' )
            .orderBy( 'budget.budget_year', 'DESC' )
            .orderBy( 'expenditure.expenditure_name' )
            .end();

        this.query( _request, req, res, this.getAllProcess.bind(this) );
    } else {
        // GET full detailed found
        var _request = new MysqlRequest().select()
            .values()
            .from( this.TABLE )
            .leftJoin( 'j_found_expenditure', this.TABLE+'.found_id', 'j_found_expenditure.fk_found_id' )
            .leftJoin( 'expenditure', 'j_found_expenditure.fk_expenditure_id', 'expenditure.expenditure_id' )
            .leftJoin( 'provider', 'expenditure.fk_provider_id', 'provider.provider_id' )
            .leftJoin( 'j_expenditure_spending', 'j_expenditure_spending.fk_expenditure_id', 'expenditure.expenditure_id' )
            .on( 'j_expenditure_spending.fk_found_id', 'found.found_id' )
            .where( req.params )
            .whereNotNull( 'expenditure.expenditure_name' )
            .orderBy( 'expenditure.expenditure_name' )
            .orderBy( 'j_expenditure_spending.date', 'ASC')
            .end();

        this.query( _request, req, res, this.getOneProcess.bind(this) );
    }
    /*
    SELECT * FROM budget
    LEFT JOIN j_found_expenditure
    ON budget.id = j_found_expenditure.fk_found_id
    LEFT JOIN expenditure
    ON j_found_expenditure.fk_expenditure_id = expenditure.id
    LEFT JOIN j_expenditure_spending
    ON expenditure.id = j_expenditure_spending.fk_expenditure_id
    WHERE budget.year = 2014;
     */

};

// PREPROCESS DATA
// -> complexe mysql request with 2 left join...
// -> transform 1d table into 2d table, to be used in D3.JS bar chart
Found.getAllProcess = function( results, res, req ) {
    var _data = results.data,
        _dataNodes = [],
        _rootNodes = {},
        _rootNode = null,
        _years = {};

    console.log('[Found]:getAll cb');

    results.data = {
        expenditures: [],
        years: []
    };

    // PREPROCESS DATA
    // -> order YEAR desc
    for (var i= 0, _l=_data.length; i<_l; ++i) {
        var _row = _data[i];

        // GET YEARS
        if (_years[_row.budget_year] == undefined) {
            _years[_row.budget_year] = results.data.years.length;
            results.data.years.push( _row.budget_year );
        }

        // GET ROOT NODES: unique expenditure_id
        var _num = _rootNodes[_row.expenditure_id];

        if (_num == undefined) {
            _rootNodes[_row.expenditure_id] = _dataNodes.length;

            var _obj = {
                name: _row.expenditure_name,
                color: _row.provider_color,
                values: []
            };
            // -> fill with empty values, if this expenditure don't appears on the first year
            for (var j= 0; j<_years[_row.budget_year]; ++j) {
                _obj.values.push( {x: j, y:0} );
            }
            _obj.values.push( {
                x: _years[_row.budget_year],
                y: _row.provision
            } );
            _dataNodes.push( _obj );
        }
        else {
            _rootNode = _dataNodes[ _num ];
            // ADD ANOTHER VALUE
            // -> fill with empty values, if this expenditure don't have values for each year
            for (var j= _rootNode.values.length; j<_years[_row.budget_year]; ++j) {
                _rootNode.values.push( {x: j, y:0} );
            }
            _rootNode.values.push( {
                x: _rootNode.values.length,
                y: _row.provision
            } );
        }
    }

    // -> fill with empty values, if an expenditure don't have values for each year
    for (var i= 0, _l=_dataNodes.length; i<_l; ++i) {
        _rootNode = _dataNodes[ i ];
        if (_rootNode.values.length < results.data.years.length) {
            for (var j= _rootNode.values.length; j < results.data.years.length; ++j) {
                _rootNode.values.push( {x: j, y:0} );
            }
        }
    }

    results.data.expenditures = _dataNodes;

    // SEND RESPONSE
    this.response( results, res, req );
};

// PREPROCESS DATA
// -> complexe mysql request with 3 left join...
// -> transform 1d table into a 2d table, to be used in D3.JS circular chart
Found.getOneProcess = function( results, res, req ) {

    console.log('[Found]:getOne cb');
    console.log( results );

    var _data = results.data,
        _total = 0,
        _dataNodes = [],
        _rootNodes = {},
        _rootNode = null,
        _l = _data.length;

    // PREPROCESS DATA
    for (var i= 0; i<_l; ++i) {
        var _row = _data[i];

        // GET ROOT NODES: unique expenditure_id
        // merge same expenditure spending (due to leftJoin)
        // if this is the first time we met this expenditure
        if (_rootNodes[_row.expenditure_id] == undefined) {
            _rootNodes[_row.expenditure_id] = _dataNodes.length;

            var _rootL = _dataNodes.push(
                {
                    id: _row.expenditure_id,
                    name: _row.expenditure_name,
                    size: _row.provision,
                    // if no expenditure spending are yet set, amount will be null
                    current: (_row.amount ? _row.amount : 0),
                    remaining: _row.provision - _row.amount,
                    provider: _row.provider_name,
                    contact: _row.provider_contact,
                    contract: _row.provider_contract,
                    color: _row.provider_color,
                    children: []
                }
            );

            if (_row.jes_id != null) {
                _dataNodes[_rootL - 1].children.push({
                    id: _row.jes_id,
                    name: _row.description,
                    size: _row.amount,
                    provider: _row.provider_name,
                    date: _row.date,
                    invoice: _row.invoice,
                    color: _row.provider_color,
                    children: []
                });
            }

            _total += _row.provision;

        } else {
            // else, add another spending
            _rootNode = _dataNodes[ _rootNodes[_row.expenditure_id] ];
            // UPDATE TOTAL SPENDING
            _rootNode.current += _row.amount;
            _rootNode.remaining -= _row.amount;

            _rootNode.children.push(
                {
                    id: _row.jes_id,
                    name: _row.description,
                    size: _row.amount,
                    provider: _row.provider_name,
                    date: _row.date,
                    invoice: _row.invoice,
                    color: _row.provider_color,
                    children: []
                }
            );
        }
    }

    results.data = _dataNodes;
    results.total = _total;
    results.found_id = req.params.found_id;

    // SEND RESPONSE
    this.response( results, res, req );
};

module.exports = Found;
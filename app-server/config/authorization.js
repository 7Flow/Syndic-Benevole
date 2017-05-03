var redis       = require('redis'),
    client      = redis.createClient();

// AUTHORIZATION CONFIGURATION
// - not used by client
// - returned by the API to hide ROLE/AUTHORIZATION config
var Authorization = {

    // route as pattern (
    // -> express interceptor doesn't know the route, only the url
    // -> declare more complex route at first)
    admin: {
        // L O G I N
        '/login': {
            GET: true, POST: true, PUT: true
        },

        // C O O W N E R S
        '/coowners': {
            GET: true, PUT: true, POST: true, DELETE: true
        },
        '/coowners/:id': {
            GET: true, PUT: true, POST: true, DELETE: true
        },

        // A P A R T M E N T S
        '/apartments': {
            GET: true, PUT: true, POST: true, DELETE: true
        },

        // B U D G E T
        '/budget/:budget_year': {
            GET: true, PUT: true, POST: true, DELETE: true
        },
        '/budget': {
            GET: true, PUT: true, POST: true, DELETE: true
        },

        // F O U N D
        '/found/:found_name': {
            GET: true, PUT: true, POST: true, DELETE: true
        },

        // D O C U M E N T S
        '/documents': {
            GET: true
        },

        // D I S C U S S I O N S
        '/discussions/:discussion_id': {
            GET: true, PUT: true, POST: true, DELETE: true
        },
        '/discussions': {
            GET: true
        },

        // D A S H B O A R D
        '/dashboard': {
            GET: true
        },
        '/dashboard/:budget_year': {
            GET: true
        },

        // D A S H B O A R D
        '/planning': {
            GET: true, POST: true
        },
        '/planning/:planning_id': {
            GET: true, PUT: true, DELETE: true
        }
    },

    supervisor: {

    },

    watcher: {

    },

    // CHECK
    // @return [Boolean]
    verify: function( role, routePath, method ) {
        return Authorization[role][routePath][method];
    },
    // GET
    // @return [Object]
    get: function( role, url ) {
        var _urls = Authorization[role],
            _match = false;

        console.log('[Authorization]::get '+role+' - '+url);

        for (var _pattern in _urls) {
            if (url.match( new RegExp(_pattern) )) {
                //console.log('-> match to '+_pattern);
                return _urls[_pattern];
            }
        }
    }
};

module.exports = Authorization;
// RUN
//----
// start MySQL server (on :8889)
// start redis server (on :6379)
// start node.js : node server.js
// start browser (on :7777)
// ! Apache (or nginx) should NOT be on 7777 !

// PROXY
//==============================================================================
var http        = require('http'),
    httpProxy   = require('http-proxy'),
    express     = require('express'),
    router      = express.Router(),

    cookie      = require('cookie-parser'),
    session     = require('express-session'),
    redis       = require('redis'),
    client      = redis.createClient(),
    RedisStore  = require('connect-redis')(session);

var proxy = httpProxy.createProxyServer( {} );

var frontServer = express();
frontServer.set('trust proxy', 1);
frontServer.use( express.static(__dirname+'/css') );
frontServer.use( express.static(__dirname+'/js') );
frontServer.use( express.static(__dirname+'/img') );
frontServer.use( express.static(__dirname+'/fonts') );

// cookie/session for api server (not used by proxy)
var sharedCookie = cookie('frontsecret');
var authSession = session({
    store: new RedisStore({
        host: 'localhost',
        port: 6379,
        db: 0,
        client: client
    }),
    secret: 'frontsecret',
    proxy: true,
    saveUninitialized: true,
    resave: true,
    httpOnly: true,
    secure: true
});

// TODO: shared session in proxy to denied access to static files
// frontServer.use( sharedCookie);
// frontServer.use( authSession );


// Server Proxy:  route
// - the API request on 8080    -> node.js backend server
// - the HTTP request on 7888   -> nginx web server
router.use( function( req, res, next ) {
    if (req.url.indexOf('api/') != -1) {
        proxy.web(req, res, {
            target: 'http://127.0.0.1:8080'
        });
    } else {
        proxy.web(req, res, {
            target: 'http://127.0.0.1:7888'
        });
    }
});
frontServer.use(router);

// HTTP front: on port 7777
// NON ADMIN CAN'T LISTEN TO PORT < 1080...
http.createServer(frontServer)
    .listen(7777, function() {
        console.log('proxy listen 7777');
    });

// BASE SETUP
// =============================================================================
var domain      = require('domain').create(),
    bodyParser  = require('body-parser'),

    authToken   = require('./app-server/base/AuthToken');


// RUN SERVER ON DOMAIN
// - catch error without shutdown node process
domain.on('error', function(error) {
    console.log( error.message );
});


domain.run( function() {
    var app     = express();
    app.set('trust proxy', 1);

    app.use( sharedCookie );
    app.use( authSession );

    // PARSE X FORM ENCODED
    app.use(bodyParser.urlencoded({extended: true}));
    // PARSE JSON
    app.use(bodyParser.json());

    // CROSS ORIGIN RESOURCE SHARING
    var allowCrossDomain = function(req, res, next) {
        // limit access to proxy: its not a public API (only auth. webapp)
        res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:7777');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.header('Access-Control-Expose-Headers', 'Authorization');
        //res.header('Access-Control-Allow-Headers', '');
        res.header('Access-Control-Allow-Credentials', 'true');
        next();
    };
    app.use( allowCrossDomain );

    // FOR EACH REQUEST, CHECK THE SESSION
    // - intercept request before router
    // - so req.router isn't defined yet!
    // (if use app.all('*'), req.route.path will always be '*')
    app.use( authToken.checkRequest );

    // ROUTES FOR OUR API
    // =============================================================================
    var router = express.Router();
    var cfg    = require('./app-server/config/api');

    //var port = process.env.PORT || 8080;
    var port = cfg.port;

    // PARSE CONFIG
    for (var moduleName in cfg.api) {
        var _module = cfg.api[moduleName];

        for (var _ctrl in _module) {
            var _service = _module[_ctrl];

            // / REQUIRE CONTROLLER
            var _ctrl = require( './app-server/'+_service.controller );
            if (_ctrl.basePath == "") _ctrl.basePath = _service.path;

            // CREATE A ROUTE FOR EACH METHOD
            var _route = router.route( _service.path );
            for (var i=0, _l=_service.methods.length; i<_l; ++i) {
                // each route defined with a function and a callback
                switch( _service.methods[i] ) {
                    case "DELETE":
                        _route.delete( _ctrl.METHOD.bind(_ctrl) );
                        break;
                    case "PUT":
                        _route.put( _ctrl.METHOD.bind(_ctrl) );
                        break;
                    case "POST":
                        _route.post( _ctrl.METHOD.bind(_ctrl) );
                        break;
                    case "GET":
                    default:
                        _route.get( _ctrl.METHOD.bind(_ctrl) );
                        break;
                }
            }
        }
    }

    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!' });
    });

    // AUTH
    var _auth = require('./app-server/controllers/Auth' );
    router.post('/login', _auth.POST );

    // REGISTER OUR ROUTES -------------------------------
    // all of our routes will be prefixed with /api
    app.use(cfg.prefix, router);

    // START THE SERVER
    // =============================================================================
    app.listen(port);
    console.log('Magic happens on port ' + port);
});

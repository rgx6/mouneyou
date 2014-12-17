var express = require('express');
var http = require('http');
var path = require('path');
var log4js = require('log4js');
var routes = require('./routes.js');

log4js.configure('log4js_configuration.json', { reloadSecs: 60 });
var appLogger = log4js.getLogger('appLog');
// appLogger.setLevel(log4js.levels.INFO);
appLogger.setLevel(log4js.levels.DEBUG);
var accessLogger = log4js.getLogger('accessLog');
accessLogger.setLevel(log4js.levels.INFO);

var app = express();
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());
app.use(log4js.connectLogger(accessLogger, {
    // express 閾値ではなく指定したログレベルで記録される
    'level': log4js.levels.INFO,
    // アクセスログを出力する際に無視する拡張子
    'nolog': [ '\\.css', '\\.js', '\\.png' ],
    // アクセスログのフォーマット
    'format': JSON.stringify({
        'remote-addr':    ':remote-addr',
        'method':         ':method',
        'url':            ':url',
        'status':         ':status',
        'http-version':   ':http-version',
        'content-length': ':content-length',
        'referrer':       ':referrer',
        'user-agent':     ':user-agent',
        'response-time':  ':response-time',
    })
}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// NODE_ENV=production node server.js  default:development
if (app.get('env') === 'development') {
    app.use(express.errorHandler({ showStack: true, dumpExceptions: true }));
    app.locals.pretty = true;
}

// 404 not found
app.use(function (req, res) {
    res.send(404);
});

// routing
var appRoot = '/';
routes.set(appRoot, app);

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    appLogger.info('Express server listening on port ' + app.get('port'));
});

process.on('uncaughtException', function (err) {
    appLogger.error('uncaughtException => ' + err);
});

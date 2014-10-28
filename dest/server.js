var express = require('express');
var http = require('http');
var path = require('path');
var log4js = require('log4js');

log4js.configure('log4js_configuration.json', { reloadSecs: 60 });
var logger = log4js.getLogger('log');
logger.setLevel(log4js.levels.INFO);

var app = express();
app.set('port', process.env.PORT || 3003);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(log4js.connectLogger(logger, {
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
app.get(appRoot, function (req, res) {
    http.get('http://urls.api.twitter.com/1/urls/count.json?url=http://mouneyou.rgx6.com/', function (apiRes) {
        apiRes.setEncoding('utf8');
        apiRes.on('data', function (chunk) {
            var data = JSON.parse(chunk);
            res.render('index', { count: data.count });
        });
    }).on('error', function (e) {
        logger.error(e);
        res.render('index', { count: '検索' });
    });
});

var server = http.createServer(app);
server.listen(app.get('port'), function () {
    logger.info('Express server listening on port ' + app.get('port'));
});

process.on('uncaughtException', function (err) {
    logger.error('uncaughtException => ' + err);
});

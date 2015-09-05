var log4js  = require('log4js');
var logger  = log4js.getLogger('appLog');
var server  = require('./server.js');
var db      = require('./db.js');

var sendClickDataInterval = 1000;

var globalUserCount = 0;
var totalClickCount = 0;
var lapClickCount   = 0;

db.ClickCount.findOne().select('count').exec(function (err, doc) {
    if (err) {
        logger.error(err);
        return;
    }

    if (doc != null) {
        totalClickCount = doc.count;
    }
});

var lapTimer = setInterval(function () {
    if (lapClickCount === 0) return;

    totalClickCount += lapClickCount;
    lapClickCount = 0;

    server.sockets.emit('send_click_data_to_client', {
        clickCount: totalClickCount,
    });

    db.ClickCount.findOneAndUpdate({
        // none
    }, {
        $set: {
            count:       totalClickCount,
            updatedTime: new Date(),
        },
        $setOnInsert: {
            registeredTime: new Date(),
        }
    }, {
        upsert: true,
    }, function (err, numberAffected) {
        if (err) {
            logger.error(err);
            return;
        }
    });
}, sendClickDataInterval);

exports.onConnection = function (client) {
    'use strict';
    logger.debug('connected : ' + client.id);

    globalUserCount += 1;

    client.emit('connected', {
        clickCount: totalClickCount,
        userCount:  globalUserCount,
    });

    client.broadcast.emit('send_user_count_to_client', {
        userCount: globalUserCount,
    });

    /**
     * クリックデータ受付
     */
    client.on('send_click_data_to_server', function (data) {
        'use strict';
        logger.debug('send_click_data_to_server : ' + client.id);

        if (typeof data === 'undefined' ||
            data === null               ||
            typeof data !== 'number'    ||
            data <= 0) {
            logger.warn('send_click_data_to_server : ' + data);
            client.disconnect();
            return;
        }

        lapClickCount += data;
    });

    /**
     * socket切断時の処理
     */
    client.on('disconnect', function() {
        'use strict';
        logger.debug('disconnect : ' + client.id);

        globalUserCount -= 1;

        server.sockets.emit('send_user_count_to_client', {
            userCount: globalUserCount,
        });
    });

};

//------------------------------
// メソッド定義
//------------------------------

/**
 * nullとundefinedのチェック
 */
function isUndefinedOrNull (data) {
    'use strict';
    logger.debug('isUndefinedOrNull');

    return typeof data === TYPE_UNDEFINED || data === null;
}

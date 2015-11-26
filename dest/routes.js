var log4js  = require('log4js');
var Promise = require('es6-promise').Promise;
var logger  = log4js.getLogger('appLog');
var db      = require('./db.js');
var uuid    = require('node-uuid');
var stampList = require('./stamplist.json');
var animeList = require('./animelist.json');

var etagStampList = '' + Date.now();
var etagAnimeList = '' + Date.now();

var tweetCountBase = 38776;

exports.set = function (appRoot, app) {
    app.get(appRoot, index);
    app.get(appRoot + 'api/stamplist', apiStampList);
    app.get(appRoot + 'api/animelist', apiAnimeList);
    app.get(appRoot + 'ranking/stamp', rankingStamp);
    app.post(appRoot + 'beginsync', beginSync);
    app.post(appRoot + 'updateorder', updateOrder);
};

var rankingStamp = function (req, res) {
    'use strict';

    db.Tweet.find().select({ _id: 0, expandedUrls: 1 }).exec(function (err, tweets) {
        if (err) {
            logger.error(err);
            res.send(500);
            return;
        }

        var counts = {};
        tweets.forEach(function (tweet) {
            if (!counts[tweet.expandedUrls]) {
                counts[tweet.expandedUrls] = 1;
            } else {
                counts[tweet.expandedUrls] += 1;
            }
        });

        var ranking = [];
        stampList.forEach(function (stamp) {
            var count = counts[stamp.src];
            if (!count) count = 0;
            ranking.push({
                id: stamp.id,
                count: count,
            });
        });

        ranking.sort(function (a, b) {
            if (a.count < b.count) return 1;
            if (a.count > b.count) return -1;
            return 0;
        });

        res.render('rankingStamp', { ranking: ranking });
        return;
    });
};

var index = function (req, res) {
    'use strict';

    getTweetCount().then(function (tweetCount) {
        var id = req.query.id;
        if (isUndefinedOrNull(id)) {
            res.render('index', {
                id:         '',
                stampOrder: [],
                stampList:  stampList,
                animeList:  animeList,
                tweetCount: tweetCount,
            });
            return;
        }

        if (id.length !== 32) {
            res.send(404);
            return;
        }

        var query = db.StampOrder.findOne({ id: id, isDeleted: false });
        query.exec(function (err, doc) {
            if (err) {
                logger.error(err);
                res.send(500);
                return;
            }

            if (!doc) {
                logger.error('id not registered : ' + id);
                res.send(404);
                return;
            }

            res.render('index', {
                id:         id,
                stampOrder: doc.stampOrder,
                stampList:  stampList,
                animeList:  animeList,
                tweetCount: tweetCount,
            });
            return;
        });
    });
};

var apiStampList = function (req, res) {
    'use strict';

    res.set('ETag', etagStampList);

    if (req.headers['if-none-match'] === etagStampList) {
        res.send(304);
    } else {
        res.status(200).json(stampList);
    }
};

var apiAnimeList = function (req, res) {
    'use strict';

    res.set('ETag', etagAnimeList);

    if (req.headers['if-none-match'] === etagAnimeList) {
        res.send(304);
    } else {
        res.status(200).json(animeList);
    }
};

var beginSync = function (req, res) {
    'use strict';

    var order = req.body.stampOrder;
    if (!checkOrder(order)) {
        res.send(400);
        return;
    }

    var id = uuid.v4().replace(/-/g, '');
    var stampOrder = new db.StampOrder();
    stampOrder.id             = id;
    stampOrder.stampOrder     = order;
    stampOrder.registeredTime = new Date();
    stampOrder.updatedTime    = new Date();
    stampOrder.isDeleted      = false;
    stampOrder.save(function (err, doc) {
        if (err) {
            logger.error(err);
            res.send(500);
            return;
        }

        res.status(200).json({ id: id });
        return;
    });
};

var updateOrder = function (req, res) {
    'use strict';

    var id = req.body.id;
    if (!checkId(id)) {
        res.send(400);
        return;
    }

    var order = req.body.stampOrder;
    if (!checkOrder(order)) {
        res.send(400);
        return;
    }

    db.StampOrder.findOneAndUpdate({
        id: id
    }, {
        $set: {
            stampOrder:  order,
            updatedTime: new Date(),
        }
    }, function (err, data) {
        if (err) {
            logger.error(err);
            res.send(500);
            return;
        }

        if (data === null) {
            logger.error('not registered id : ' + id);
            res.send(500);
            return;
        }

        res.status(200).json({});
        return;
    });
};

function getTweetCount () {
    'use strict';

    return new Promise(function (fulfill, reject) {
        db.Tweet.count(function (err, count) {
            if (err) {
                logger.error(err);
                fulfill();
                return;
            }

            fulfill(tweetCountBase + count);
        });
    });
}

function checkOrder (order) {
    'use strict';

    if (isUndefinedOrNull(order)) {
        logger.error('order is null');
        return false;
    }

    if (!Array.isArray(order)) {
        logger.error('order is not array : ' + JSON.stringify(order));
        return false;
    }

    for (var i = 0; i < order.length; i++) {
        if (isNaN(order[i])) {
            logger.error('order is NaN : ' + order[i]);
            return false;
        }
    }

    return true;
}

function checkId (id) {
    'use strict';

    if (isUndefinedOrNull(id)) {
        logger.error('id is null');
        return false;
    }

    if (id.length !== 32) {
        logger.error('invalid id : ' + id);
        return false;
    }

    return true;
}

function isUndefinedOrNull (data) {
    'use strict';

    return typeof data === 'undefined' || data === null;
}

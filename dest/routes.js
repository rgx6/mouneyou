var Promise = require('es6-promise').Promise;
var log4js  = require('log4js');
var logger  = log4js.getLogger('appLog');
var db      = require('./db.js');
var uuid    = require('uuid');
var stampList = require('./stamplist.json');
var animeList = require('./animelist.json');

var etagStampList = '' + Date.now();
var etagAnimeList = '' + Date.now();

exports.set = function (appRoot, app) {
    app.get(appRoot, index);
    app.get(appRoot + 'api/stamplist', apiStampList);
    app.get(appRoot + 'api/animelist', apiAnimeList);
    app.post(appRoot + 'beginsync', beginSync);
    app.post(appRoot + 'updateorder', updateOrder);
};

var index = function (req, res) {
    'use strict';

    var id = req.query.id;

    if (isUndefinedOrNull(id)) {
        res.render('index', {
            id:         '',
            stampOrder: [],
            stampList:  stampList,
            animeList:  animeList,
        });
        return;
    }

    if (id.length !== 32) {
        res.sendStatus(404);
        return;
    }

    db.StampOrder.findOne({ id: id, isDeleted: false })
        .exec()
        .then((doc) => {
            if (!doc) {
                logger.error('id not registered : ' + id);
                res.sendStatus(404);
                return;
            }

            res.render('index', {
                id: id,
                stampOrder: doc.stampOrder,
                stampList: stampList,
                animeList: animeList,
            });

            return;
        })
        .catch((err) => {
            logger.error(err);
            res.sendStatus(500);
            return;
        });
};

var apiStampList = function (req, res) {
    'use strict';

    res.set('ETag', etagStampList);

    if (req.headers['if-none-match'] === etagStampList) {
        res.sendStatus(304);
    } else {
        res.status(200).json(stampList);
    }
};

var apiAnimeList = function (req, res) {
    'use strict';

    res.set('ETag', etagAnimeList);

    if (req.headers['if-none-match'] === etagAnimeList) {
        res.sendStatus(304);
    } else {
        res.status(200).json(animeList);
    }
};

var beginSync = function (req, res) {
    'use strict';

    var order = req.body.stampOrder;

    if (!checkOrder(order)) {
        res.sendStatus(400);
        return;
    }

    var id = uuid.v4().replace(/-/g, '');
    var stampOrder = new db.StampOrder();
    stampOrder.id             = id;
    stampOrder.stampOrder     = order;
    stampOrder.registeredTime = new Date();
    stampOrder.updatedTime    = new Date();
    stampOrder.isDeleted      = false;

    stampOrder
        .save()
        .then((doc) => {
            res.status(200).json({ id: id });
            return;
        })
        .catch((err) => {
            logger.error(err);
            res.sendStatus(500);
            return;
        });
};

var updateOrder = function (req, res) {
    'use strict';

    var id = req.body.id;
    if (!checkId(id)) {
        res.sendStatus(400);
        return;
    }

    var order = req.body.stampOrder;

    if (!checkOrder(order)) {
        res.sendStatus(400);
        return;
    }

    db.StampOrder.findOneAndUpdate(
        {
            id: id,
        },
        {
            $set: {
                stampOrder: order,
                updatedTime: new Date(),
            },
        }
    )
        .then((data) => {
            if (data === null) {
                logger.error('not registered id : ' + id);
                res.sendStatus(500);
                return;
            }

            res.status(200).json({});
            return;
        })
        .catch((err) => {
            logger.error(err);
            res.sendStatus(500);
            return;
        });
};

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

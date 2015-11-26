var Twitter = require('twitter');
var Promise = require('es6-promise').Promise;
var log4js  = require('log4js');
var db      = require('./db.js');
var config  = require('./twitter_configuration.js');

log4js.configure('log4js_configuration.json', { reloadSecs: 60 });

var logger = log4js.getLogger('twitterLog');
logger.setLevel(log4js.levels.INFO);
// logger.setLevel(log4js.levels.DEBUG);

var client;

var queryUrl            = 'http://mouneyou.rgx6.com/';
var queryCount          = 100;
var queryDefaultSinceId = '665564226052751360';

var searchQuery = {
    q:        queryUrl,
    count:    queryCount,
    since_id: queryDefaultSinceId,
};

var searchInterval = 10 * 1000;

var isSearching = false;

var apiErrorLimit = 10;
var apiErrorCount = 0;

// log4jsの初期化が間に合わないようなので少し待つ
setTimeout(function () {
    logger.info('start');

    client = new Twitter(config);

    logger.debug('search start');
    setQuerySinceId().then(getTweets);

    var timer = setInterval(function () {
        if (apiErrorLimit <= apiErrorCount) {
            logger.error('stop api error count is over');
            clearInterval(timer);
            return;
        }

        if (isSearching) {
            logger.debug('search skip');
        } else {
            logger.debug('search start');
            // since_idはそのままだけどmax_idは毎回初期化する
            delete(searchQuery.max_id);
            setQuerySinceId().then(getTweets);
        }
    }, searchInterval);
}, 1000);

function setQuerySinceId () {
    'use strict';
    logger.debug('setQuerySinceId');

    return new Promise(function (fulfill, reject) {
        isSearching = true;

        var query = db.Tweet.findOne().select({ tweetId: 1 }).sort({ createdAt: 'desc', tweetId: 'desc' });
        query.exec(function (err, doc) {
            if (err) {
                logger.error(err);
                isSearching = false;
                reject(err);
                return;
            }

            if (doc != null && doc.tweetId != null) {
                searchQuery.since_id = doc.tweetId;
            }

            logger.debug('fulfill');
            fulfill();
        });
    });
}

function getTweets (max_id_str) {
    'use strict';
    logger.debug('getTweets', max_id_str);

    if (max_id_str != null) searchQuery.max_id = max_id_str;

    logger.debug(searchQuery);

    client.get('search/tweets', searchQuery, function (error, tweets, response) {
        if (error) {
            apiErrorCount += 1;
            logger.error(error);
            isSearching = false;
            return;
        }

        apiErrorCount = 0;

        var nextMaxId;

        tweets.statuses.forEach(function (tweet, index, array) {
            nextMaxId = tweet.id_str;

            var mediaUrls = [];
            var expandedUrls = [];
            if (tweet.entities != null && tweet.entities.media != null) {
                tweet.entities.media.forEach(function (media, index, array) {
                    if (media.media_url != null) mediaUrls.push(media.media_url);
                    if (media.expanded_url != null) expandedUrls.push(media.expanded_url);
                });
            }

            db.Tweet.find({ tweetId: tweet.id_str }, function (err, docs) {
                if (0 < docs.length) {
                    logger.debug('exists', tweet.id_str);
                    return;
                }

                var data = new db.Tweet();
                data.tweetId        = tweet.id_str;
                data.userScreenName = tweet.user.screen_name;
                data.mediaUrls      = mediaUrls;
                data.expandedUrls   = expandedUrls;
                data.createdAt      = Date.parse(tweet.created_at);
                data.registeredTime = new Date();
                data.save(function (err, doc) {
                    if (err) {
                        logger.error(err);
                        return;
                    }

                    logger.debug('saved', data.tweetId);
                });
            });
        });

        var count = tweets.statuses.length;
        logger.debug('count: ', count);
        if (count <= 1) {
            logger.debug('search end');
            isSearching = false;
            return;
        }

        getTweets(nextMaxId);
    });
}

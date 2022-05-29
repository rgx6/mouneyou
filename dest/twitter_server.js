const Twitter = require('twitter');
const Promise = require('es6-promise').Promise;
const log4js = require('log4js');
const db = require('./db.js');
const config = require('./twitter_configuration.js');

log4js.configure('log4js_configuration.json', { reloadSecs: 60 });

const logger = log4js.getLogger('twitterLog');

let client;

const queryUrl = 'mouneyou.rgx6.com';
const queryCount = 100;
const queryDefaultSinceId = '665564226052751360';

const searchQuery = {
    q: queryUrl,
    count: queryCount,
    since_id: queryDefaultSinceId,
};

const searchInterval = 10 * 1000;

let isSearching = false;

const apiErrorLimit = 10;
let apiErrorCount = 0;

main();

async function main() {
    // log4jsの初期化が間に合わないようなので少し待つ
    await new Promise(resolve => setTimeout(resolve, 1000));

    logger.info('start');

    client = new Twitter(config);

    logger.debug('search start');
    getTweets();

    let timer = setInterval(function () {
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
            delete (searchQuery.max_id);
            setQuerySinceId().then(getTweets);
        }
    }, searchInterval);
}

function setQuerySinceId() {
    'use strict';
    logger.debug('setQuerySinceId');

    return new Promise(function (fulfill, reject) {
        isSearching = true;

        let query = db.Tweet.findOne().select({ tweetId: 1 }).sort({ createdAt: 'desc', tweetId: 'desc' });
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

function getTweets(max_id_str) {
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

        let nextMaxId;

        tweets.statuses.forEach(function (tweet, index, array) {
            nextMaxId = tweet.id_str;

            let mediaUrls = [];
            let expandedUrls = [];
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

                let data = new db.Tweet();
                data.tweetId = tweet.id_str;
                data.userScreenName = tweet.user.screen_name;
                data.mediaUrls = mediaUrls;
                data.expandedUrls = expandedUrls;
                data.createdAt = Date.parse(tweet.created_at);
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

        let count = tweets.statuses.length;
        logger.debug('count: ', count);
        if (count <= 1) {
            logger.debug('search end');
            isSearching = false;
            return;
        }

        getTweets(nextMaxId);
    });
}

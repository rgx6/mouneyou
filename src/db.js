(function () {
    'use strict';

    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;

    var StampOrderSchema = new Schema({
        id:             { type: String,  require: true, index: true },
        stampOrder:     { type: Array,   require: true },
        registeredTime: { type: Date,    require: true },
        updatedTime:    { type: Date,    require: true },
        isDeleted:      { type: Boolean, require: true },
    });
    mongoose.model('StampOrder', StampOrderSchema);

    var ClickCountSchema = new Schema({
        count:          { type: Number, require: true },
        registeredTime: { type: Date,   require: true },
        updatedTime:    { type: Date,   require: true },
    });
    mongoose.model('ClickCount', ClickCountSchema);

    var TweetSchema = new Schema({
        tweetId:        { type: String,   require: true, index: true, unique: true },
        userScreenName: { type: String,   require: true  },
        mediaUrls:      { type: [String], require: false },
        expandedUrls:   { type: [String], require: false },
        createdAt:      { type: Number,   require: true, index: true },
        registeredTime: { type: Date,     require: true  },
    });
    mongoose.model('Tweet', TweetSchema);

    mongoose.connect('mongodb://localhost/mouneyou', {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    exports.StampOrder = mongoose.model('StampOrder');
    exports.ClickCount = mongoose.model('ClickCount');
    exports.Tweet      = mongoose.model('Tweet');
})();

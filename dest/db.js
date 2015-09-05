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

    mongoose.connect('mongodb://localhost/mouneyou');

    exports.StampOrder = mongoose.model('StampOrder');
    exports.ClickCount = mongoose.model('ClickCount');
})();

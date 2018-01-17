var config = require('./config');
var mongoose = require('mongoose');

module.exports = function() {
    mongoose.set('debug', config.debug);
    var db = mongoose.connect(config.mongoUri);

    require('../app/models/user.model');

    return db;
}
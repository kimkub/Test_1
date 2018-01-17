var mongoose = require('mongoose');
var crypto = require('crypto');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstName: String,
    lastName: String,
    username: { type: String, unique: true, trim: true, required: 'Username is required' },
    email: { type: String, index: true, match: /.+\@.+\.+/ },
    password: {
        type: String,
        validate: [
            function (password) {
                return password && password.length >= 6;
            },
            'Password must be at least 6 characters'
        ]
    },
    created: {
        type: Date,
        default: Date.now
    },
    salt: {
        type: String
    },
    provider: {
        type: String,
        required: 'Provider is required'
    },
    providerId: String,
    providerData: {}
});

UserSchema.pre('save', function (next) {
    if (this.password) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});

UserSchema.method.hashPassword = function (password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
}

UserSchema.method.authenticate = function (password) {
    return this.password === this.hashPassword(password);
}

mongoose.model('User', UserSchema);
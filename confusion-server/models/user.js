const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    admin: {
        type: Boolean,
        default: false,
    },
});

let Users = mongoose.model('User', userSchema);

module.exports = Users;

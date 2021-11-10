const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    favoriteDishes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }]
});

let Favorites = mongoose.model('Favorites', favoriteSchema);

module.exports = Favorites;

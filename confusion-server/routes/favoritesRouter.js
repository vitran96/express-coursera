const express = require('express');
const Favorites = require('../models/favorite')
const authenticate = require('../authenticate');
const cors = require('../conf/cors');

const favoriteRouter = express.Router();

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            Favorites.findOne({ user: req.user._id })
                .populate('user')
                .populate('dishes')
                .then(favorite => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, next)
                .catch(next);
        })
    .post(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            // console.log(req.body);
            Favorites.findOne({ user: req.user._id })
                .then(favorite => {
                    if (favorite) {
                        req.body.forEach(dishId => {
                            if (!favorite.dishes.some(dishObjectId => dishObjectId.equals(dishId._id))) {
                                favorite.dishes.push(dishId);
                            }
                        });

                        favorite.save()
                            .then(updatedFavorite => {
                                Favorites.findById(updatedFavorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then(populatedFavorite => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(populatedFavorite);
                                    }, next)
                            }, next)
                    } else {
                        Favorites.create({
                            user: req.user._id,
                            dishes: req.body
                        }).then(favorite => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then(populatedFavorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(populatedFavorite);
                                }, next);
                        }, next)
                    }
                }, next)
                .catch(next)
        })
    .put(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /favorites');
        })
    .delete(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            Favorites.findOneAndDelete({ user: req.user._id })
                .then(resp => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, next)
                .catch(next);
        });

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('GET operation not supported on /favorites/:dishId');
        })
    .post(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            Favorites.findOne({ user: req.user._id })
                .then(favorite => {
                    if (favorite) {
                        const dishId = req.params.dishId;
                        if (!favorite.dishes.some(dishObjectId => dishObjectId.equals(dishId))) {
                            favorite.dishes.push(dishId);
                        }

                        favorite.save()
                            .then(updatedFavorite => {
                                Favorites.findById(updatedFavorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then(populatedFavorite => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(populatedFavorite);
                                    }, next)
                            }, next)
                    } else {
                        Favorites.create({
                            user: req.user._id,
                            dishes: {
                                _id: req.params.dishId
                            }
                        }).then(favorite => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then(populatedFavorite => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(populatedFavorite);
                                }, next);
                        }, next)
                    }
                }, next)
                .catch(next)
        })
    .put(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /favorites/:dishId');
        })
    .delete(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            Favorites.findOne({ user: req.user._id })
                .then(favorite => {
                    if (favorite) {
                        const dishId = req.params.dishId;
                        const index = favorite.dishes.indexOf(dishId);
                        if (index !== -1) {
                            favorite.dishes.splice(index, 1);
                        }

                        favorite.save()
                            .then(updatedFavorite => {
                                Favorites.findById(updatedFavorite._id)
                                    .populate('user')
                                    .populate('dishes')
                                    .then(populatedFavorite => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(populatedFavorite);
                                    }, next);
                            }, next)
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({});
                    }
                }, next)
                .catch(next);
        });

module.exports = favoriteRouter;

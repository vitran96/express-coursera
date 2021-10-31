const express = require('express');
const Dishes = require('../models/dishes')
const authenticate = require('../authenticate');

const dishRouter = express.Router();

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        Dishes.find({})
            .populate('comments.author')
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.create(req.body)
                .then((dish) => {
                    // console.log('Dish Created ', dish);
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        });
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .put(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /dishes');
        })
    .delete(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        });

dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /dishes/:dishId');
        })
    .put(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.findByIdAndUpdate(
                req.params.dishId
                , { $set: req.body }
                , { new: true })
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .populate('comments.author')
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        });
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .delete(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.findByIdAndRemove(req.params.dishId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        });

dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(
        authenticate.verifyUser
        , (req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null) {
                        dish.comments.push({
                            ...req.body
                            , author: req.user._id
                        });
                        dish.save()
                            .then((dish) => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    });
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .put(
        authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /dishes/'
                + req.params.dishId + '/comments');
        })
    .delete(
        authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null) {
                        for (var i = (dish.comments.length - 1); i >= 0; i--) {
                            dish.comments.id(dish.comments[i]._id).remove();
                        }
                        dish.save()
                            .then((dish) => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    });
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        });

dishRouter.route('/:dishId/comments/:commentId')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate('comments.author')
            .then((dish) => {
                if (dish
                    && dish.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                } else if (!dish) {
                    err = Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(
        authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /dishes/' + req.params.dishId
                + '/comments/' + req.params.commentId);
        })
    .put(
        authenticate.verifyUser
        , (req, res, next) => {
            // TODO: Allow a registered user to submit comments (already completed), update a submitted comment and delete a submitted comment.
            // The user should be restricted to perform such operations only on his/her own comments.
            // No user or even the Admin can edit or delete the comments submitted by other users
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish
                        && dish.comments.id(req.params.commentId)) {

                        if (req.body.rating) {
                            dish.comments.id(req.params.commentId).rating = req.body.rating;
                        }

                        if (req.body.comment) {
                            dish.comments.id(req.params.commentId).comment = req.body.comment;
                        }

                        dish.save()
                            .then((dish) => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    });
                            }, (err) => next(err));
                    } else if (!dish) {
                        err = Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    } else {
                        err = Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        })
    .delete(
        authenticate.verifyUser
        , (req, res, next) => {
            // TODO: Allow a registered user to submit comments (already completed), update a submitted comment and delete a submitted comment.
            // The user should be restricted to perform such operations only on his/her own comments.
            // No user or even the Admin can edit or delete the comments submitted by other users
            Dishes.findById(req.params.dishId)
                .then((dish) => {
                    if (dish
                        && dish.comments.id(req.params.commentId)) {
                        dish.comments.id(req.params.commentId).remove();
                        dish.save()
                            .then((dish) => {
                                Dishes.findById(dish._id)
                                    .populate('comments.author')
                                    .then(dish => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(dish);
                                    });
                            }, (err) => next(err));
                    } else if (!dish) {
                        err = Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    } else {
                        err = Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        });

module.exports = dishRouter;

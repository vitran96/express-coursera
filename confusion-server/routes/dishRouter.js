const express = require('express');
const Dishes = require('../models/dishes')
const authenticate = require('../authenticate');
const cors = require('../conf/cors');

const dishRouter = express.Router();

dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        console.log(req.query);
        Dishes.find(req.query)
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, next)
            .catch(next);
    })
    .post(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.create(req.body)
                .then((dish) => {
                    // console.log('Dish Created ', dish);
                    Dishes.findById(dish._id)
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        });
                }, next)
                .catch(next);
        })
    .put(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /dishes');
        })
    .delete(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, next)
                .catch(next);
        });

dishRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, next)
            .catch(next);
    })
    .post(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /dishes/:dishId');
        })
    .put(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.findByIdAndUpdate(
                req.params.dishId
                , { $set: req.body }
                , { new: true })
                .then((dish) => {
                    Dishes.findById(dish._id)
                        .then(dish => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        });
                }, next)
                .catch(next);
        })
    .delete(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Dishes.findByIdAndRemove(req.params.dishId)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, next)
                .catch(next);
        });

module.exports = dishRouter;

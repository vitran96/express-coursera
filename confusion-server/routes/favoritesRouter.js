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
            // TODO:
        })
    .post(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            // TODO:
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
            // TODO:
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
            // TODO:
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
            // TODO:
        });

module.exports = favoriteRouter;

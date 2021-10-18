const express = require('express');
const mongoose = require('mongoose');
const Dishes = required('../models/dishes')

const dishRouter = express.Router();

dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /dishes');
    })
    .delete((req, res, next) => {
        res.end('Deleting all dishes');
    });

dishRouter.route('/:dishId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end(`Will send dish with id ${req.params.dishId} to you!`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /dishes/:dishId');
    })
    .put((req, res, next) => {
        res.end(`Will update dish id ${req.params.dishId} with details: ${req.body.description}`);
    })
    .delete((req, res, next) => {
        res.end('Deleting dish with id ' + req.params.dishId);
    });

module.exports = dishRouter;

const express = require('express');

const leaderRouter = express.Router();

leaderRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /leaders');
    })
    .delete((req, res, next) => {
        res.end('Deleting all leaders');
    });

leaderRouter.route('/:leaderId')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end(`Will send leader with id ${req.params.leaderId} to you!`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /leaders/:leaderId');
    })
    .put((req, res, next) => {
        res.end(`Will update leader id ${req.params.leaderId} with details: ${req.body.description}`);
    })
    .delete((req, res, next) => {
        res.end('Deleting leader with id ' + req.params.leaderId);
    });

module.exports = leaderRouter;

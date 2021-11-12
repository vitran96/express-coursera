const express = require('express');
var authenticate = require('../authenticate');
const cors = require('../conf/cors');

const Comments = require('../models/comments');

const commentRouter = express.Router();

commentRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(
        cors.cors
        , (req, res, next) => {
            Comments.find(req.query)
                .populate('author')
                .then((comments) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comments);
                }, next)
                .catch(next);
        })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (!req.body) {
            req.body.author = req.user._id;
            Comments.create(req.body)
                .then((comment) => {
                    Comments.findById(comment._id)
                        .populate('author')
                        .then((comment) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(comment);
                        })
                }, next)
                .catch(next);
        } else {
            err = Error('Comment not found in request body');
            err.status = 404;
            return next(err);
        }

    })
    .put(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('PUT operation not supported on /comments/');
        })
    .delete(
        cors.corsWithOptions
        , authenticate.verifyUser
        , authenticate.verifyAdmin
        , (req, res, next) => {
            Comments.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(resp);
                }, next)
                .catch(next);
        });

commentRouter.route('/:commentId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(
        cors.cors
        , (req, res, next) => {
            Comments.findById(req.params.commentId)
                .populate('author')
                .then((comment) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(comment);
                }, next)
                .catch(next);
        })
    .post(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            res.statusCode = 403;
            res.end('POST operation not supported on /comments/' + req.params.commentId);
        })
    .put(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            Comments.findById(req.params.commentId)
                .then((comment) => {
                    if (!comment) {
                        if (!comment.author.equals(req.user._id)) {
                            var err = Error('You are not authorized to update this comment!');
                            err.status = 403;
                            return next(err);
                        }

                        req.body.author = req.user._id;
                        Comments.findByIdAndUpdate(req.params.commentId, {
                            $set: req.body
                        }, { new: true })
                            .then((comment) => {
                                Comments.findById(comment._id)
                                    .populate('author')
                                    .then((comment) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(comment);
                                    })
                            }, next);
                    }
                    else {
                        err = Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, next)
                .catch(next);
        })
    .delete(
        cors.corsWithOptions
        , authenticate.verifyUser
        , (req, res, next) => {
            Comments.findById(req.params.commentId)
                .then((comment) => {
                    if (!comment) {
                        if (!comment.author.equals(req.user._id)) {
                            var err = Error('You are not authorized to delete this comment!');
                            err.status = 403;
                            return next(err);
                        }

                        Comments.findByIdAndRemove(req.params.commentId)
                            .then((resp) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(resp);
                            }, next)
                            .catch(next);
                    }
                    else {
                        err = Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, next)
                .catch(next);
        });

module.exports = commentRouter;

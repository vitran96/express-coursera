const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://localhost:3001'];
var corsOptionsDelegate = (req, callback) => {
    // console.log(req.header('Origin'));
    const corsOptions = whitelist.indexOf(req.header('Origin')) !== -1
        ? { origin: true }
        : { origin: false };

    callback(null, corsOptions);
};

exports.cors = cors();
exports.corsWithOptions = cors(corsOptionsDelegate);

const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

server.get('/accounts', (req, res) => {
    db('accounts')
        .then(accounts => res.status(200).json(accounts))
        .catch(err => res.status(500).json(err))
});

module.exports = server;
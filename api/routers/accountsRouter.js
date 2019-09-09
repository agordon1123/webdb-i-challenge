const express = require('express');
const router = express.Router();

const db = require('../../data/dbConfig.js');

router.get('/', (req, res) => {
    db('accounts')
        .then(accounts => res.status(200).json(accounts))
        .catch(err => res.status(500).json(err))
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db('accounts').where({ id })
        .then(account => res.status(200).json(account))
        .catch(err => res.status(500).json(err))
});

module.exports = router;

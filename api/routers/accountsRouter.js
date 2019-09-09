const express = require('express');
const router = express.Router();

const db = require('../../data/dbConfig.js');

// CREATE
router.post('/', validateAccountBody, (req, res) => {
    const newAccount = req.body;
    db('accounts').insert(newAccount)
        .then(success => res.status(201).json({ message: `Successfully created new account with ID: ${success}`}))
        .catch(err => res.status(500).json(err))
});

// READ
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

// UPDATE
router.put('/:id', validateAccountBody, (req, res) => {
    const { id } = req.params;
    const changes = req.body;
    changes.budget = parseInt(req.body.budget);

    db('accounts').where({ id })
        .update(changes)
        .then(success => res.status(201).json(success))
        .catch(() => res.status(500).json({ error: 'Internal server error' }))
});

// DELETE
router.delete('/:id', validateAccountId, (req, res) => {
    const { id } = req.params;

    db('accounts').where({ id })
        .del()
        .then(() => res.status(200).json({ message: `Successfully deleted account with ID: ${id}`}))
        .catch(err => res.status(500).json(err))
});

// Middleware
function validateAccountBody(req, res, next) {
    const newAccount = req.body;
    if (!newAccount.name || !newAccount.budget) {
        res.status(400).json({ error: 'Please include a valid name(string) and budget(number) with your request' });
    } else {
        next();
    };
};

function validateAccountId(req, res, next) {
    const { id } = req.params;
    db('accounts').where({ id })
        .then(success => {
            if (success) {
                next();
            } else {
                res.status(404).json({ error: 'No accounts with the given ID exist' });
            }
        })
        .catch(err => res.status(500).json({ error: 'Internal server error' }));
};

function convertStringToNum(req, res, next) {
    const num = req.body.budget;
    if (isNaN(num)) {
        parseInt(num);
        next();
    } else {
        next();
    }
}

module.exports = router;

const express = require('express');
const router = express.Router();
const userService = require('./gadget.service');

// routes
router.get('/', getAll);

module.exports = router;

function getAll(req, res, next) {
    userService.getAll(req)
        .then(users => res.json(users))
        .catch(next);
}

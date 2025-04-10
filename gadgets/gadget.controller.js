const express = require('express');
const router = express.Router();
const gadgetService = require('./gadget.service');

// routes
router.get('/', getAll);
router.post('/saveNew', saveNew);

module.exports = router;

function getAll(req, res, next) {
    gadgetService.getAll(req)
        .then(gadgets => res.json(gadgets))
        .catch(next);
}

function saveNew(req, res, next) {
    gadgetService.saveNew(req)
        .then(data => res.json(data))
        .catch(next);
}

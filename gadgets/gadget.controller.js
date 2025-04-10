const express = require('express');
const router = express.Router();
const gadgetService = require('./gadget.service');

// routes
router.get('/', getAll);
router.post('/saveNew', saveNew);
router.delete('/delete/:id', deleteGadget);
router.post('/deleteMultiple', deleteMultiple);
router.get('/getSingle/:id', getSingle);
router.post('/update', updateSingle);

module.exports = router;

function getAll(req, res, next) {
    gadgetService.getAll(req)
        .then(gadgets => res.json(gadgets))
        .catch(next);
}

function getSingle(req, res, next) {
    gadgetService.getSingle(req)
        .then(gadgets => res.json(gadgets))
        .catch(next);
}

function saveNew(req, res, next) {
    gadgetService.saveNew(req)
        .then(data => res.json(data))
        .catch(next);
}

function updateSingle(req, res, next) {
    gadgetService.updateSingle(req)
        .then(data => res.json(data))
        .catch(next);
}

function deleteGadget(req, res, next) {
    gadgetService.deleteGadget(req)
        .then(data => res.json(data))
        .catch(next);
}

function deleteMultiple(req, res, next) {
    gadgetService.deleteMultiple(req)
        .then(data => res.json(data))
        .catch(next);
}

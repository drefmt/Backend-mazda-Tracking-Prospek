const router = require('express').Router();
const spkController = require('../controller/spk.controllers');

const {verifyToken, authorizeRoles} = require('../middleware/auth.middleware')

router.get('/', verifyToken, authorizeRoles('sales','svp',), spkController.findAllSpk);

router.get('/:id', verifyToken, authorizeRoles('sales','svp'), spkController.findSpkById);
router.post('/', verifyToken, authorizeRoles('sales'), spkController.createSpk);
router.put('/:id', verifyToken, authorizeRoles('sales'), spkController.updateSpk);
router.delete('/:id', verifyToken, authorizeRoles('sales'), spkController.deleteSpk);


module.exports = router;
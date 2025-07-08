const router = require('express').Router();
const prospekControllers = require('../controller/prospek.controllers');
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/', verifyToken, authorizeRoles('sales'), prospekControllers.createProspek);
router.get('/available-for-spk', verifyToken, authorizeRoles('sales'), prospekControllers.findAvailableProspekForSpk);
router.get('/', verifyToken, authorizeRoles('svp','sales','admin'), prospekControllers.findAllProspek);
router.get('/:id', verifyToken,authorizeRoles('sales','svp'), prospekControllers.findProspekById);
router.put('/:id', verifyToken,authorizeRoles('sales'),prospekControllers.updateProspek);
router.delete('/:id', verifyToken, authorizeRoles('sales'), prospekControllers.deleteProspek);

// // follow-up
router.get("/:id/follow-Up/:followUpId", verifyToken, authorizeRoles('sales','svp'), prospekControllers.getFollowUpById);
router.post("/:id/follow-Up", verifyToken, authorizeRoles('sales','svp'), prospekControllers.addFollowUp);
router.delete("/:id/follow-Up/:followUpId", verifyToken, authorizeRoles('sales','svp'), prospekControllers.deleteFollowUp);
router.put("/:id/follow-Up/:followUpId", verifyToken, authorizeRoles('sales','svp'), prospekControllers.updateFollowUp);

// report

module.exports = router;
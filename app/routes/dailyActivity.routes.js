const router = require('express').Router();
const  dailyActivity  = require('../controller/DailyActivity.controller');
const { authorizeRoles, verifyToken } = require('../middleware/auth.middleware')

router.post('/', verifyToken, authorizeRoles('sales'), dailyActivity.createActivity);
router.get('/', verifyToken, authorizeRoles('sales', 'svp'), dailyActivity.findAllActivity);
router.put('/:id', verifyToken, authorizeRoles('sales'), dailyActivity.updateActivity);
router.delete('/:id', verifyToken, authorizeRoles('sales'), dailyActivity.deleteActivity);
router.get('/:id', verifyToken, authorizeRoles('sales'), dailyActivity.findActivityById);

module.exports = router;
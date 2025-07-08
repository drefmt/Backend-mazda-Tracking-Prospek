const router = require('express').Router();
const  dashboard  = require('../controller/dashboard.controller');
const { authorizeRoles, verifyToken } = require('../middleware/auth.middleware')

router.get('/summary', verifyToken, authorizeRoles('sales','svp'), dashboard.getSummary);
router.get('/convertion', verifyToken, authorizeRoles('sales','svp'), dashboard.getConversion)
router.get('/yearly-activity', verifyToken, authorizeRoles('sales','svp'), dashboard.getYearlyActivity);
router.get('/top-sales', verifyToken, authorizeRoles('svp'), dashboard.getTopPerformers);
module.exports = router

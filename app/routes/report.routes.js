const router = require('express').Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth.middleware');

const prospekReport = require('../controller/prospekReport.controller');
const testDriveReport = require('../controller/testDriveReport.controllers');
const spkReports = require('../controller/spkReport.controller');
const retailReport = require('../controller/retailReport.controller');
const followUpReport  = require('../controller/followUpReport.controller');
const salesPerformaceReport = require('../controller/salesPerformance.controller');
const reportEvaluation = require('../controller/reportEvaluation.controller');
const userReport = require('../controller/reportUser.controller')
const feedbackReport = require('../controller/feedbackReport.controller')
const dailyActivity = require('../controller/dailyActivityReport.controller')
 



router.get('/prospek', verifyToken, authorizeRoles('svp'), prospekReport.reportProspek)
router.get('/test-drive', verifyToken, authorizeRoles('svp'), testDriveReport.testDriveReport)
router.get('/spk', verifyToken, authorizeRoles('svp'), spkReports.spkReports);
router.get('/retail', verifyToken, authorizeRoles('svp'), retailReport.retail);
router.get('/follow-up', verifyToken, authorizeRoles('svp'), followUpReport.reportFollowUp);
router.get('/sales-performance', verifyToken, authorizeRoles('svp'), salesPerformaceReport.reportSalesPerformance);
router.get('/evaluation', verifyToken, authorizeRoles('svp'), reportEvaluation.getSalesEvaluationReport);
router.get('/users', verifyToken, authorizeRoles('svp'), userReport.getUserReport);
router.get('/feedback', verifyToken, authorizeRoles('svp'), feedbackReport.feedback);
router.get('/activity', verifyToken, authorizeRoles('svp'), dailyActivity.reportDailyActivity);

module.exports = router;
const router = require('express').Router();
const feedback = require('../controller/feedback.controller')

router.get('/feedback')
router.get("/feedback-link", feedback.getAllFeedbackLinks); // admin only
router.get("/feedback/:token", feedback.getTokenInfo);
router.delete("/feedback-link/:id", feedback.deleteFeedbackLink);

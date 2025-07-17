const express = require('express');
const router = express.Router();
const notification = require('../controller/notification.controller');
const { authorizeRoles, verifyToken } = require('../middleware/auth.middleware')


router.get('/', verifyToken, authorizeRoles('sales','svp'), notification.getUserNotifications);
router.patch('/:id/read', verifyToken, authorizeRoles('sales','svp'), notification.markAsRead);
router.delete('/:id', verifyToken, authorizeRoles('sales','svp'), notification.deleteNotification);

module.exports = router;

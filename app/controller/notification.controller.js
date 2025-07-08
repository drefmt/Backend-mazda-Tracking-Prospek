const db = require('../models')
const Notification = db.notification;


exports.getUserNotifications = async (req, res) => {
    try {
        const notification = await Notification.find({userId: req.user._id}).sort({createdAt: -1});
        res.json(notification)
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve notification' });
        
    }
}

exports.markAsRead = async (req, res) => {
    try {
        await Notification.findByIdAndUpdate(req.params.id, { isRead: true});
        res.json({ message: 'Notification Is Read'});
    } catch (error) {
        res.status(500).json({ error: 'Faield to update notification'});
    }
}
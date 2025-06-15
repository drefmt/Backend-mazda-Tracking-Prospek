module.exports = (mongoose) => {
    const notificationSchema = new mongoose.Schema(
        {
            recipientId: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User',                    
            },
            level: {
                type: String,
                enum: ['sales','spv'],
                required: true,
            },
            title: String,
            message: String,
            isRead: {
                type: Boolean,
                default: false
            },
        },
        { timestamps: true }
    );
    const notification = mongoose.model('Notification', notificationSchema);
    return notification;
}


module.exports = (mongoose) => {
  // models/DailyActivity.js

const dailyActivitySchema = new mongoose.Schema({
  salesId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  activityType: {
    type: String,
    enum: ['Meeting', 'Follow Up', 'Test Drive', 'Prospecting', 'Admin Work', 'Other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  isDone: {
    type: Boolean,
    default: false
  },
  location: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});
  dailyActivitySchema.method("toJSON", function () {
    const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
    object.id = _id;
    object.createdAt = createdAt;
    object.updatedAt = updatedAt;
    return object;
  });

  const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);
  return DailyActivity;
};




module.exports = (mongoose) => {

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
    enum: ['Meeting', 'Follow Up', 'Test Drive', 'Prospecting', 'Admin Work','Other'],
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
  dailyActivitySchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });
  const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);
  return DailyActivity;
};


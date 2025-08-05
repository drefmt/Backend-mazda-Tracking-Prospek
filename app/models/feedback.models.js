module.exports = (mongoose) => {
  const feedbackSchema = new mongoose.Schema({
    retailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retail",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      default: "Anonim",
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  });
    
    feedbackSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });

  const feedback = mongoose.model("Feedback", feedbackSchema);
  return feedback;
};

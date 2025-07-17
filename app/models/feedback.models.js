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
    feedbackSchema.method("toJSON", function () {
    const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
    object.id = _id;
    object.createdAt = createdAt;
    object.updatedAt = updatedAt;
    return object;
  });

  const feedback = mongoose.model("Feedback", feedbackSchema);
  return feedback;
};

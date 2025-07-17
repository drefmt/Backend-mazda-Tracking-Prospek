const { v4: uuidv4 } = require("uuid");

module.exports = (mongoose) => {
  const feedbackLinkSchema = new mongoose.Schema({
    token: {
      type: String,
      default: uuidv4, // token acak
      unique: true,
    },

    feedbackId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },

    retailId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Retail",
      required: true,
    },
    expiredAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  feedbackLinkSchema.method("toJSON", function () {
    const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
    object.id = _id;
    object.createdAt = createdAt;
    object.updatedAt = updatedAt;
    return object;
  });
  const feedbackLink = mongoose.model("FeedbackLink", feedbackLinkSchema);
  return feedbackLink;
};

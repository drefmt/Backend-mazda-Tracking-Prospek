module.exports = (mongoose) => {
  const retailSchema = new mongoose.Schema(
    {
      salesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
      spkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Spk",
        required: true,
      },
      dateRetail: {
        type: Date,
        require: true,
      },
      carType: {
        type: String,
        require: true,
      },
    },
    { timestamps: true }
  );
  retailSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });
  const Retail = mongoose.model("Retail", retailSchema);
  return Retail;
};

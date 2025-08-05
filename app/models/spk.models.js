module.exports = (mongoose) => {
  const spkSchema = new mongoose.Schema(
    {
      prospekId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Prospek",
        required: true,
      },
      salesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      dateSpk: {
        type: Date,
        requierd: true,
      },
      noKtp: {
        type: String,
        required: true,
      },
      cashOrCredit: {
        type: String,
        enum: ["Cash", "Credit"],
        required: true,
      },
      downPayment: {
        type: Number,
        required: true,
      },
      tenor: {
        type: String,
      },
      leasing: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        enum: ["Draft", "Process Do", "Cancel", "Delivered"],
      },
    },

    { timestamps: true }
  );

  // spkSchema.method("toJSON", function () {
  //   const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
  //   object.id = _id;
  //   object.createdAt= createdAt
  //   object.updatedAt= updatedAt
  //   return object;
  // });

  spkSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });

  const spk = mongoose.model("Spk", spkSchema);
  return spk;
};

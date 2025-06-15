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
        required: true,
      },
      leasing: {
        type: String,
        required: true,
      },    
      status: {
        type: String,
        required: true,
        enum: ["Process Do","Cancel"],
      },    
    },

    { timestamps: true }
  );

  spkSchema.method("toJSON", function () {
    const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
    object.id = _id;
    object.createdAt= createdAt
    object.updatedAt= updatedAt
    return object;
  });

  const spk = mongoose.model("Spk", spkSchema);
  return spk;
};

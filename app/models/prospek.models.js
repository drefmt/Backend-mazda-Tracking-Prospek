module.exports = (mongoose) => {
  const prospekSchema = new mongoose.Schema(
    {
      salesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        required: true,
      },
      whatsappNum: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      source: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['Prospek','Test-Drive','SPK'],
        required: true,
      },
      carType: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
        enum: ["Low", "Medium", "Hot"],
      },
      followUps: [
        {
          followUpDate: { type: Date, required: true },
          salesProces: { type: String },
          interaction: {
            type: String,
            enum: ["Telepon", "WhatsApp", "Email", "Kunjungan", "Lainnya"],
            requirdd: true,
          },
          note: { type: String },
          customerResponse: { type: String },
          recommendation: { type: String },
        },
      ],
    },
    { timestamps: true }
  );
  prospekSchema.method("toJSON", function () {
    const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
    object.id = _id;
    object.createdAt = createdAt;
    object.updatedAt = updatedAt;
    return object;
  });

  const Prospek = mongoose.model("Prospek", prospekSchema);
  return Prospek;
};

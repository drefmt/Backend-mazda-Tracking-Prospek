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
        enum: ["Prospek", "Test-Drive", "SPK"],
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

      // Predict Score Variable

      demografi: {
        usia: Number,
        jenisKelamin: { type: String, enum: ["Laki-laki", "Perempuan"] },
        pekerjaan: String,
        penghasilan: Number,
      },
      psikografis: {
        minat: [String], // contoh: ["Mobil Sport", "Hemat BBM"]
        gayaHidup: String, // contoh: "Aktif", "Santai", "Modern"
        motivasi: String, // contoh: "Gengsi", "Kebutuhan Keluarga"
      },
      perilaku: {
        frekuensiKontak: Number, // jumlah follow-up
        responAwal: String, // contoh: "Cepat", "Lambat"
        interaksiFavorit: String, // contoh: "WhatsApp"
      },
      lingkungan: {       
        sumber: String, // contoh: "Teman", "Keluarga", "Iklan"
      },
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

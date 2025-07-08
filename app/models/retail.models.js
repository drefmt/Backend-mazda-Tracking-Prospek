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
            dateRetail:{
                type: Date,
                require: true,
            },           
            carType: {
                type: String,
                require: true
            }
        },
        { timestamps: true }

    );
    retailSchema.method("toJSON", function () {
        const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
        object.id = _id;
        object.createdAt = createdAt;
        object.updatedAt = updatedAt;
        return object;
      });
      const Retail = mongoose.model("Retail", retailSchema);
      return Retail;
}


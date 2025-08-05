module.exports = (mongoose) => {
    const testDriveScema = new mongoose.Schema({
        prospekId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prospek',
            required: true,
        },
        salesId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        dateTestDrive : {
            type : Date,
            required: true
        },
        carType : {
            type: String,
            required: true
        }
        
    },     { timestamps: true }
);  

   testDriveScema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });
      
    const testDrive = mongoose.model('TestDrive', testDriveScema);
    return testDrive;
}
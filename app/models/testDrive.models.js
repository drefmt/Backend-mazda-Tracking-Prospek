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

    testDriveScema.method("toJSON", function () {
        const { __v, _id, createdAt, updatedAt, ...object } = this.toObject();
        object.id = _id;
        object.createdAt = createdAt;
        object.updatedAt = updatedAt;
        return object;
      });
      
    const testDrive = mongoose.model('TestDrive', testDriveScema);
    return testDrive;
}
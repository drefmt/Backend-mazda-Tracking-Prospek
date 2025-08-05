const bcrypt = require('bcryptjs');

module.exports = (mongoose) => {
    const userSchema = new mongoose.Schema({ 
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        level: {
            type: String,
            enum: [ "sales", "svp"],
            default: "sales",
            required: true,
        },
    }, { timestamps: true }); 


  userSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_, ret) => {
      ret.id = ret._id.toString();
      delete ret._id;
    },
  });

    userSchema.pre("save", async function (next) {
        // @ts-ignore
        if (!this.isModified('password')) return next();
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    });

    userSchema.methods.comparePassword = async function (password) {
        return bcrypt.compare(password, this.password);
    }
    const User = mongoose.model('User', userSchema);
    return User;
}
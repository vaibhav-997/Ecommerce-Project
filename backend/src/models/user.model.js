import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role:{
      type: String,
      enum:["NORMAL","ADMIN"],
      default: "NORMAL"
    },
    avatar: {
      type: String,
    },
    refreshToken: {
      type: String || undefined,
      default:undefined
    },
  },
  {
    timestamps: true,
   
  }
);



// Use function keyword for pre-save hook to enable 'this' context
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Change the argument order in the compare function
userSchema.methods.isPasswordCorrect = async function (password) {
  let result = await bcrypt.compare(password, this.password);
  return result;
};

userSchema.methods.generateAccessToken = function () {
    // console.log(process.env.JWT_ACCESS_TOKEN_EXPIRY)
  return jwt.sign(
    {
      _id: this._id,
      username: this.username,
      email: this.email,
      role:this.role
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY, // Corrected variable name
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  let token =  jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY } // Corrected variable name
  );
  this.refreshToken = token
  return token
};

const User = model('User', userSchema);

export { User };

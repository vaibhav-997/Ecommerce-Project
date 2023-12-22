import { User } from '../models/user.model.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import Joi from 'joi';
import bcrypt from 'bcryptjs'

import jwt from 'jsonwebtoken'

// Validating the request body for registration 
const userRegistrationValidation = (username, email, password) => {
  const user = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().min(3).max(30).required(),
    password: Joi.string().min(3).max(30).required(),
  });

  const validatedUser = user.validate({ username, email, password });
  return validatedUser;
};


// Validating the request body for login
const userLoginValidation = (username, email, password) => {
  const user = Joi.object({
    username: Joi.string().min(3).max(30),
    email: Joi.string().email().min(3).max(30),
    password: Joi.string().min(3).max(30).required(),
  });

  const validatedUser = user.validate({ username, email, password });
  return validatedUser;
};


//generating the refresh and accesstoken for the login
const generateAccessTokenAndRefreshToken = async (user) => {
  let accessToken = await user.generateAccessToken(); // Use instance method on user object
  let refreshToken = await user.generateRefreshToken(); // Use instance method on user object
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })
  return { accessToken, refreshToken };
};


// UserController class with all the auth methods
class UserController {


  // User registration method
  static async registerUser(req, res) {
    try {
      const { username, email, password } = req.body;
      const userValidata = userRegistrationValidation(username, email, password);

      if (!username || !email || !password) {
        return res.json({
          success: false,
          message: 'All fields are required',
        });
      }

      if (userValidata.error) {
        return res.json({ success: false, message: userValidata.error.message });
      }

      const isUserExists = await User.findOne({
        $or: [{ email }, { username }],
      });

      if (isUserExists)
        return res.json({
          success: false,
          message: 'User already exists with the username or email',
        });

      let avatar;
      if (req.file) {
        avatar = req.file.path;
      }

      let cloudinaryUpload = await uploadToCloudinary(avatar);

      let userAvatar = cloudinaryUpload?.secure_url;

      const createdUser = await User.create({
        email,
        password,
        username,
        avatar: userAvatar || '',
      });

      let user;
      if (createdUser) {
        user = await User.findById({ _id: createdUser._id }).select('-password');
      }

      return res.json({
        success: true,
        message: 'User Registration Success',
        payload: user,
      });
    } catch (error) {
      return res.json({ success: false, message: 'Error Creating User' });
    }
  }


  // User login method
  static async loginUser(req, res) {
    try {
      const { username, email, password } = req.body;
      const validateUser = userLoginValidation(username, email, password);
      if (validateUser.error) {
        return res.json({
          success: false,
          message: validateUser.error.message
        })
      }
      if(!username && !email) {
        return res.json(
        {
          success:false,
          message:"Username or Email is required"
        }
        )
      }

      
      const user = await User.findOne({
        $or: [{ username }, { email }],
      });
      
      
      if (!user) {
        return res.json({
          success: false,
          message: 'User not found! Please register the user before login',
        });
      }
      
      let hashedPasswordCheck = await bcrypt.compare(password, user.password)

      if(!hashedPasswordCheck) return res.json({success:false, message: 'Password Missmatch'})


      const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);
      const userData = await User.findOne({
        $or:[{email}, {username}]
      }).select("-password -refreshToken")
      const options = {
        httpOnly: true,
        secure: true,
      };
      return res
        .cookie('accessToken', accessToken, options)
        .cookie('refreshToken', refreshToken, options)
        .json({
          success: true,
          message: 'User logged in successfully',
          payload:userData,
          token: {
            accessToken,
            refreshToken,
          },
        });
    } catch (error) {
      return res.json({
        success: false,
        message: 'token expired!, Please relogin'
      })
    }
  }

  // Generating new access token
  static async refreshAccessToken(req, res) {
    try {

      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res.json({
          success: false,
          message: 'Refresh token not provided',
        });
      }

      const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

      // Use the decodedRefreshToken to find the user in the database
      const user = await User.findById(decodedRefreshToken._id);

      if (!user) {
        return res.json({
          success: false,
          message: 'User not found',
        });
      }

      if(refreshToken !== user.refreshToken) {
        return res.json({success: false, message: 'Refresh token Ivalid'})
      }
      // Generate a new access token 
      const newAccessToken = await user.generateAccessToken()


      const options = {
        httpOnly: true,
        secure: true,
      };



      return res
        .cookie('accessToken', newAccessToken, options)

        .json({
          success: true,
          message: 'Access token refreshed successfully',
          token: {
            accessToken: newAccessToken,

          },
        });
    } catch (error) {
      return res.json({
        success: false,
        message: `Invalid refresh token or ${error.message}! Please Login again`,
      });
    }
  }

  // User logout method

  static async logoutUser(req, res) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        { _id: req.user._id },
        { $unset: { refreshToken: 1 } },
        { new: true }
      );
  
      const options = {
        httpOnly: true,
        secure: true,
      };
  
      
  
      return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json({ success: true, message: "User logged out" });
    } catch (error) {
      return res.json({
        success: false,
        message: "Error logging out user",
        error: error.message,
      });
    }
}

// update user avatar
static async updateUserAvatar(req, res){
  try {
    let user = req.user
    let avatarImage = req.file
    if(!avatarImage) return res.json({success:false, message:"Avatar required"})
    let updatedAvatarImage = await uploadToCloudinary(avatarImage.path)
    let updatedUser =   await User.findByIdAndUpdate(user._id,{avatar:updatedAvatarImage.secure_url},{new:true})
    if(!updatedUser) return res.json({success:false, message:"User not found"})
    return res.json({success:true, message:"User avatar updated successfully", })
  } catch (error) {
    return res.json({success:false, message:"Avatar updation failed"})
  }
}

// get current user
static async getCurrentUser(req, res){
  return res.json({success:true, payload:req.user})
}

// update user password
static async updateUserPassword(req, res){
  try {
    const {oldPassword, newPassword} = req.body
    if(!oldPassword || !newPassword) return res.json({success:false, message:"Old and New password required"})
    let user  = await User.findById(req.user._id)
    let hashedPasswordCheck = await bcrypt.compare(oldPassword, user.password)
    if(!hashedPasswordCheck) return res.json({success:false, message:"Incorrect old password"})
    user.password = newPassword
  user.save({validateBeforeSave:false})
  return res.json({success:true, message:"User password changed successFully"})
  } catch (error) {
    return res.json({success:false, message:"Error while changing the password"})
  }
}
}

export { UserController };

import jwt from "jsonwebtoken"
import User from "../models/User.js"

// generate jwt

const generateToken = (id) =>{
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_Expire || "7d"
    });
};

// @desc Register new user 
// @route POST /api/auth/register
// @access public

export const register =  async(req, res ,next) =>{
    try{
  const {username,email,password} = req.body;

  // check if user exist 
  const userExists = await User.findOne({$or:[{email}]});
  if(userExists){
    return res.status(400).json({
        success:false,
        error:
        userExists.email === email ? "Email already registered" : "Username already taken",
        statusCode:400,
    });
  }
    
  // create USer

  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token

  const token = generateToken(user._id);
  res.status(201).json({
    success:true,
    data:{
      user:{
        id:user._id,
        username:user.username,
        email:user.email,
        profileImage:user.profileImage,
        createdAt:user.createdAt,
      },
      token,
    },
    message:"User Registered successfully"
  });
} 
    catch(error){
  next(error)
    }
};


// desc login user
// route  post api/auth/login
//access public

export const login  = async(req,res,next)=>{
try{
  const {email,password} = req.body

  // Validate Input 

  if(!email || !password){
    return res.status(400).json({
      success:false,
      error:"Please provide email and password",
      statusCode:400,
    });
  }

  // Check for user (include password for comparison)
  const user = await User.findOne({email}).select("+password");
  if(!user){
    return res.status(401).json({
      success:false,
      error:"Invalid credentials",
      statusCode:401
    });

  }
  // check password 
  const isMatch = await user.matchPassword(password)
  if(!isMatch){
    return res.status(401).json({
      success:false,
      error:"password is incorrect",
      statusCode:401
    })
  }
  // Generate Token

  const token = generateToken(user._id);
  res.status(200).json({
    success:true,
    user:{
      id: user._id,
      username: user.username,
      email:user.email,
      profileImage:user.profileImage

    },
    token,
    message:"Login Successfull"
  })
    }
    catch(error){
  next(error)
    }
};

// get user profile
// route get api/authprofile
// access private

export const getProfile = async (req,res,next)=>{
try{
const user = await User.findById(req.user._id);
 res.status(200).json({
  success:true,
  data:{
    id:user._id,
    username:user.username,
    email : user.email,
    profileImage:user.profileImage,
    createdAt:user.createdAt,
    updatedAt:user.updatedAt,
  }
 })
    }
    catch(error){
  next(error)
    }
}


// Change Update Profile
// PUT /api/auth/profile
// private
export const updateProfile =async (req,res,next)=>{
try{

    }
    catch(error){
  next(error)
    }
}

// Change Password
// POST /api/auth/change-password
// private

export const changePassword =async (req,res,next)=>{
try{

    }
    catch(error){
  next(error)
    }
}


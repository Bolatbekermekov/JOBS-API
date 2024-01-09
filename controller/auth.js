const User = require("../models/user")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError,UnauthenticatedError} = require("../error/index")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async (req,res,next)=>{
  // const {name,email,password} = req.body
  // // if(!name || !email || !password){
  // //   return next(new BadRequestError("Please provide name, email and password"))
  // // }
  // const salt = await bcrypt.genSalt(10)
  // const hashPassword  = await bcrypt.hash(password,salt)

  // const tempUser = {name,email,password:hashPassword}

  
  const user = await User.create({...req.body})
  const token = user.createJWT()
  // const token = jwt.sign({userId:user._id,name:user.name},'jwtSecret',{
  //   expiresIn:'30d'
  // })

  res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
  // res.status(StatusCodes.CREATED).json({user:{name:user.getName()},token})

}

const login = async (req,res,next)=>{
  const {email,password} = req.body
  if (!email || !password){
    return next(new BadRequestError("Please provide email and password"))
    }
  
  const user = await User.findOne({email})
  if (!user){
    return next(new UnauthenticatedError("Invalid Credentials"))
  }
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect){
    return next(new UnauthenticatedError("Invalid Credentials"))
  }
  
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports = {register,login}
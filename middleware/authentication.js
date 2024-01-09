const User = require('../models/user')
const jwt = require('jsonwebtoken')
const {UnauthenticatedError} = require("../error/index")

const auth = async( req,res,next)=>{
  //check header
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")){
    return next(new UnauthenticatedError("Authentication invalid"))
  }
  const token = authHeader.split(' ')[1]
  try{
    const payload = jwt.verify(token,process.env.JWT_SECRET)
    //attach the user to the job routes
    const user = User.findById(payload.id).select('-password')
    req.user =user
    req.user = {userId:payload.userId,name:payload.name}
    next()
  }catch(err){
    return next(new UnauthenticatedError("Authentication invalid"))
  }
}


module.exports = auth
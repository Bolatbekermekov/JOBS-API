const Job = require("../models/jobs")
const {StatusCodes} = require("http-status-codes")
const {BadRequestError,NotFoundError} = require("../error/index") 


const getAllJobs = async (req,res)=>{
  const jobs = await Job.find({createdBy:req.user.userId}).sort('createdAt')
  res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}

const getJob = async (req,res,next)=>{
  const {user:{userId},
  params:{id:JobId}} = req
  const job = await Job.findOne({
    _id:JobId,
    createdBy:userId
  })
  if(!job){
    return next(new NotFoundError(`No Job with thid id ${JobId}`))
  }
  res.status(StatusCodes.OK).json({job})

}

const createJob = async (req,res)=>{
  req.body.createdBy = req.user.userId
  const job = await Job.create(req.body)
  res.status(StatusCodes.CREATED).json({job})
}

const updateJob = async (req,res,next)=>{
  const {
  body:{company,position},
  user:{userId},
  params:{id:JobId}} = req

 if(!company || !position){
    return next(new BadRequestError("Company or Position fields cannot be empty"))
  }

  const job = await Job.findOneAndUpdate(
    {
    _id:JobId,
    createdBy:userId
    },
    req.body,
    {new:true,
    runValidators:true}
  )
 
  if(!job){
    return next(new NotFoundError(`No Job with thid id ${JobId}`))
  }
  res.status(StatusCodes.OK).json({job})}


const deleteJob = async (req,res,next)=>{
  const {
    user:{userId},
    params:{id:JobId}} = req
  
  
    const job = await Job.findOneAndDelete(
      {
      _id:JobId,
      createdBy:userId
      }
    )
   
    if(!job){
      return next(new NotFoundError(`No Job with thid id ${JobId}`))
    }
    res.status(StatusCodes.OK).json({msg:"this job successfully deleted!!!"})}

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
}
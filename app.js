const express = require("express")
const app = express()

// extra security packages

const helmet = require('helmet')
const cors = require("cors")
const xss = require("xss-clean")
const rateLimit = require("express-rate-limit")

const connectDb = require('./db/connect')
const authenticateUser = require("./middleware/authentication")
const notFound = require("./error/not-found")
const CustomAPIError = require("./error/error")
const errorHandler = require("./error/error-handler")
require('dotenv').config()
require('express-async-errors')

//ruotes
const jobsRouter = require("./routes/main")
const authRouter = require("./routes/log-reg")



app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())
app.set('trust proxy',1)
app.use(rateLimit({
  windowMs:15 * 60 * 1000,//15minutes
  max:100 //limit each ip to 100 requests per windows 
}))



app.get("/",(req,res)=>{
  res.send("Jobs Api")
})

// app.use(express.static("./public"))
app.use("/api/auth",authRouter)
app.use("/api/jobs",authenticateUser,jobsRouter)

app.use(errorHandler)
app.use(notFound)
app.use(CustomAPIError)


const port = process.env.PORT || 3000;
const start = async()=>{
  try{ await connectDb(process.env.MONGO_URI)
    app.listen(port,()=>console.log(`app listening on port ${port}`))
  }
  catch(err)
  {console.log(err);}
}
start()

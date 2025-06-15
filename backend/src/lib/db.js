import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();
export const connectDB = async()=>{
    await mongoose.connect(process.env.MONGODB_URI).then(()=>{console.log('mongo db connected sucecssfully')}).catch((err)=>{console.log(err)})
}
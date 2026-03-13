import mongoose from "mongoose";
import { configDotenv } from 'dotenv';

configDotenv();

const connectDb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error('error connecting mongodb',error);
    }
}

export default connectDb;

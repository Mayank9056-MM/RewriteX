import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;

        if(!mongoUri){
            throw new Error("MONGODB_URI not found in env");
        }

        await mongoose.connect(mongoUri,{
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        })

        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
}

export default connectDB;
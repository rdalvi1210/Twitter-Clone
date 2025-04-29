import mongoose from "mongoose";

const connectDb = async () => {
    try {
       const con =  await mongoose.connect(process.env.MONGO_URL);
       if(con){
           console.log("MongoDB connected successfully");
       }
       else{
        console.log("DB Error");
       }
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

export default connectDb;

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDb from "./utils/db.js";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import messageRoute from "./routes/message.route.js"
import {app, server} from "./socket/socket.js"
    
dotenv.config({
    path: ".env"
});


const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json()); // Parse incoming JSON requests
app.use(cookieParser()); // Parse cookies
app.use(express.urlencoded({ extended: true })); // Use express's built-in urlencoded

const corsOptions = {
    origin: "http://localhost:5173", 
    credentials: true 
};
app.use(cors(corsOptions));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "I am coming from backend",
        success: true
    });
});

app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    connectDb();
});

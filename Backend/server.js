import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 8080;


// Middleware

app.use(express.json());

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use(cookieParser());


// Routes

app.use("/api", chatRoutes);

app.use("/api/auth", authRoutes);


// Start Server

app.listen(PORT, () => {

    console.log(`server running on ${PORT}`);

    connectDB();

});


// Connect MongoDB

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGODB_URL);

        console.log("Connected with Database!");

    } catch(err) {

        console.log("Failed to connect with DB", err);

    }

};
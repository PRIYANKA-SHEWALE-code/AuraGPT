import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User.js";

const router = express.Router();


// ==========================================
// REGISTER
// ==========================================

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check required fields
        if (!name || !email || !password) {

            return res.status(400).json({
                error: "Name, email and password are required"
            });

        }


        // Check password length
        if (password.length < 6) {

            return res.status(400).json({
                error: "Password must be at least 6 characters"
            });

        }


        // Check whether user already exists
        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });


        if (existingUser) {

            return res.status(409).json({
                error: "User already exists"
            });

        }


        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);


        // Create user
        const user = await User.create({

            name,

            email: email.toLowerCase(),

            password: hashedPassword

        });


        res.status(201).json({

            message: "User registered successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (err) {

        console.log("Register Error:", err);

        res.status(500).json({
            error: "Failed to register user"
        });

    }

});



// ==========================================
// LOGIN
// ==========================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;


        // Check required fields
        if (!email || !password) {

            return res.status(400).json({
                error: "Email and password are required"
            });

        }


        // Find user
        const user = await User.findOne({
            email: email.toLowerCase()
        });


        if (!user) {

            return res.status(401).json({
                error: "Invalid email or password"
            });

        }


        // Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );


        if (!isPasswordCorrect) {

            return res.status(401).json({
                error: "Invalid email or password"
            });

        }


        // Create JWT
        const token = jwt.sign(

            {
                userId: user._id.toString()
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );


        // Store JWT in HTTP-only cookie
        res.cookie("token", token, {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge: 7 * 24 * 60 * 60 * 1000

        });


        res.json({

            message: "Login successful",

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (err) {

        console.log("Login Error:", err);

        res.status(500).json({
            error: "Failed to login"
        });

    }

});



// ==========================================
// CHECK CURRENT USER
// ==========================================

router.get("/me", async (req, res) => {

    try {

        const token = req.cookies.token;


        if (!token) {

            return res.status(401).json({
                error: "Not authenticated"
            });

        }


        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        const user = await User.findById(
            decoded.userId
        ).select("-password");


        if (!user) {

            return res.status(401).json({
                error: "User not found"
            });

        }


        res.json({

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });


    } catch (err) {

        return res.status(401).json({
            error: "Not authenticated"
        });

    }

});



// ==========================================
// LOGOUT
// ==========================================

router.post("/logout", (req, res) => {

    res.clearCookie("token", {

        httpOnly: true,

        secure: false,

        sameSite: "lax"

    });


    res.json({
        message: "Logged out successfully"
    });

});


export default router;
import express from "express";

import Thread from "../models/Thread.js";

import getGeminiAPIResponse from "../utils/openai.js";

import authMiddleware from "../middleware/auth.js";


const router = express.Router();


// ==========================================
// GET ALL THREADS
// ==========================================

router.get(
    "/thread",
    authMiddleware,
    async (req, res) => {

        try {

            const threads = await Thread.find({

                userId: req.user.userId

            }).sort({

                updatedAt: -1

            });


            res.json(threads);


        } catch (err) {

            console.log(err);

            res.status(500).json({

                error: "Failed to fetch threads"

            });

        }

    }
);



// ==========================================
// GET ONE THREAD
// ==========================================

router.get(
    "/thread/:threadId",
    authMiddleware,
    async (req, res) => {

        const { threadId } = req.params;


        try {

            const thread = await Thread.findOne({

                threadId: threadId,

                userId: req.user.userId

            });


            if (!thread) {

                return res.status(404).json({

                    error: "Thread not found"

                });

            }


            res.json(thread.messages);


        } catch (err) {

            console.log(err);

            res.status(500).json({

                error: "Failed to fetch thread"

            });

        }

    }
);



// ==========================================
// DELETE THREAD
// ==========================================

router.delete(
    "/thread/:threadId",
    authMiddleware,
    async (req, res) => {

        const { threadId } = req.params;


        try {

            const deletedThread =
                await Thread.findOneAndDelete({

                    threadId: threadId,

                    userId: req.user.userId

                });


            if (!deletedThread) {

                return res.status(404).json({

                    error: "Thread not found"

                });

            }


            res.status(200).json({

                success: "Thread deleted successfully"

            });


        } catch (err) {

            console.log(err);

            res.status(500).json({

                error: "Failed to delete thread"

            });

        }

    }
);



// ==========================================
// CHAT
// ==========================================

router.post(
    "/chat",
    authMiddleware,
    async (req, res) => {

        const {
            threadId,
            message
        } = req.body;


        if (!threadId || !message) {

            return res.status(400).json({

                error: "Missing required fields"

            });

        }


        try {

            // Find thread belonging to logged-in user
            let thread = await Thread.findOne({

                threadId: threadId,

                userId: req.user.userId

            });


            // Create new thread
            if (!thread) {

                thread = new Thread({

                    threadId: threadId,

                    userId: req.user.userId,

                    title: message,

                    messages: [

                        {
                            role: "user",

                            content: message
                        }

                    ]

                });

            }

            // Existing thread
            else {

                thread.messages.push({

                    role: "user",

                    content: message

                });

            }


            // Get Gemini response
            const assistantReply =
                await getGeminiAPIResponse(message);


            // Save assistant message
            thread.messages.push({

                role: "assistant",

                content: assistantReply

            });


            // Update time
            thread.updatedAt = new Date();


            // Save thread
            await thread.save();


            res.json({

                reply: assistantReply

            });


        } catch (err) {

            console.log(
                "Chat Error:",
                err
            );


            res.status(500).json({

                error: "Failed to process chat"

            });

        }

    }
);


export default router;
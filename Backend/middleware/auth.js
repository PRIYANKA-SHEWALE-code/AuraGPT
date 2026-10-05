import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {

    try {

        const token = req.cookies.token;


        // No token
        if (!token) {

            return res.status(401).json({
                error: "Authentication required"
            });

        }


        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );


        // Store user information in request
        req.user = {
            userId: decoded.userId
        };


        next();


    } catch (err) {

        console.log("Auth Error:", err);

        return res.status(401).json({
            error: "Invalid or expired token"
        });

    }

};


export default authMiddleware;
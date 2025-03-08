const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header("Authorization");

    // If no token is found
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    // Check if the token starts with "Bearer " (standard format)
    if (!token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid Token Format" });
    }

    // Remove "Bearer " part to get the token
    const tokenWithoutBearer = token.slice(7).trim();

    try {
        // Use jwt.verify() to decode and verify the token
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);

        // Attach the decoded user information to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();
    } catch (error) {
        // Handle specific errors like expired token or invalid token
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Session Expired: Please log in again" });
        } else {
            return res.status(401).json({ message: "Invalid Token" });
        }
    }
};

module.exports = verifyToken;

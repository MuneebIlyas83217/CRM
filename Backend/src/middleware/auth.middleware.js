import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key-12345';

// Verify JWT token middleware
export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access Denied. No token provided." });
        }

        const token = authHeader.split(" ")[1];
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Contains id, email, role
        
        next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
};

// Authorize Roles middleware
// Usage: router.post("/add-customer", verifyToken, authorizeRoles('admin', 'manager'), addCustomer)
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(401).json({ message: "Unauthorized. Role not found." });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden. You do not have permission to perform this action." });
        }

        next();
    };
};

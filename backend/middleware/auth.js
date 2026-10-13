import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });

  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid or expired token." });
    req.userId = decoded.id;
    next();
  });
};

export default auth;

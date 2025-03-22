import jwt from "jsonwebtoken";
import  config from "../config/config.js";

export const jwtAuthMiddleware = (req,res, next) => {

  //Extract the token after the Bearer in the request headers
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
        
    req.user = decoded;
    
    next();
  }
  catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

export const generateToken = (userData) => {

  return jwt.sign(userData, config.jwtSecret);

};

import jwt from "jsonwebtoken";
import  config from "../config/config.js";

export const jwtAuthMiddleware = (req,res, next) => {

  //Extract the token after the Bearer in the request headers
  const token = req.headers.authorization.split(" ")[1];

  //If token is not provided, then send response of unauthorized
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {

    //If we got a token in the request, verify that token 
    // with on the spot generated token using secret key
    const decoded = jwt.verify(token, config.jwtSecret);
    
    //On successful verification, store the user details in the req object
    req.user = decoded;
    
    //Go to the controller after this
    next();
  }
  catch {
    res.status(401).json({ error: "Invalid token" });
  }
};

//Generate a token with the user details and jwt secret
export const generateToken = (userData) => {

  return jwt.sign(userData, config.jwtSecret);

};

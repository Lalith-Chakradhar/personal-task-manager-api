import { generateToken } from "../middlewares/auth.js";
import {
  createUserService,
  verifyUserService,
} from "../services/auth.service.js";
import logger from "../utils/logger.js";

export const registerUser = async (req, res, next) => {
  try {

    //get the user data from request body
    const data = req.body;

    //Log info about the incoming registration request
    logger.info("Registration request received", 
      { reqMethod: req.method, reqUrl: req.originalUrl });

    //create a new user
    const newUser = await createUserService(data);

    //send a success response with created status code on creating a user
    res
      .status(201)
      .json({ message: "Registration was successful", user: newUser });
    
    // Log info about the successful user registration
    logger.info("User registered successfully", 
      { reqMethod: req.method, reqUrl: req.originalUrl });

  } catch (err) {

    // Log error before passing it to the next middleware
    logger.error("Registration failed", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: err.stack,
    });

    //Pass the error to next middleware (which is a error handler)
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {

    //get the user data from request body
    const data = req.body;

    // Log info about the incoming login request
    logger.info("Login request received", 
      { reqMethod: req.method, reqUrl: req.originalUrl });

    //verify the user credentials stored in the db
    const verifiedUser = await verifyUserService(data);

    const userData = {
      id: verifiedUser.id,
      username: verifiedUser.username,
    };
    
    //Generate a new token using the user details like id and username
    const token = generateToken(userData);

    res.status(200).json({ message: "Login Successful!", token });

    // Log info about successful login
    logger.info("User logged in successfully", 
      { reqMethod: req.method, reqUrl: req.originalUrl });

  } catch (err) {
    
    logger.error("Login failed", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: err.stack,
    });

    next(err);
  }
};

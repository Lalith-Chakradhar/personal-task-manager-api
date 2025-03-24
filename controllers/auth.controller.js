import winston from "winston/lib/winston/config/index.js";
import { generateToken } from "../middlewares/auth.js";
import {
  createUserService,
  verifyUserService,
} from "../services/auth.service.js";
import "./loggers.js";

const infoLogger = winston.loggers.get("infoLogger");
const errorLogger = winston.loggers.get("errorLogger");

export const registerUser = async (req, res, next) => {
  try {

    //get the user data from request body
    const data = req.body;

    //Log info about the incoming registration request
    infoLogger.info("Registration request received", 
      { username: data.username, email: data.email });

    //create a new user
    const newUser = await createUserService(data);

    //send a success response with created status code on creating a user
    res
      .status(201)
      .json({ message: "Registration was successful", user: newUser });
    
    // Log info about the successful user registration
    infoLogger.info("User registered successfully", 
      { userId: newUser.id, username: newUser.username });

  } catch (err) {

    // Log the error before passing it to the next middleware
    errorLogger.error("Registration failed", { error: err.message, stack: err.stack });

    //Pass the error to next middleware (which is a error handler)
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {

    //get the user data from request body
    const data = req.body;

    // Log info about the incoming login request
    infoLogger.info("Login request received", { email: data.email });

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
    infoLogger.info("User logged in successfully", 
      { userId: verifiedUser.id, username: verifiedUser.username });

  } catch (err) {
    // Log the error before passing it to the next middleware
    errorLogger.error("Login failed", { error: err.message, stack: err.stack });

    next(err);
  }
};

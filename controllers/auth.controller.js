import { generateToken } from "../middlewares/auth.js";
import {
  createUserService,
  verifyUserService,
} from "../services/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {

    //get the user data from request body
    const data = req.body;

    //create a new user
    const newUser = await createUserService(data);

    //send a success response with created status code on creating a user
    res
      .status(201)
      .json({ message: "Registration was successful", user: newUser });
  } catch (err) {

    //Pass the error to next middleware (which is a error handler)
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {

    //get the user data from request body
    const data = req.body;

    //verify the user credentials stored in the db
    const verifiedUser = await verifyUserService(data);

    const userData = {
      id: verifiedUser.id,
      username: verifiedUser.username,
    };
    
    //Generate a new token using the user details like id and username
    const token = generateToken(userData);

    res.status(200).json({ message: "Login Successful!", token });
  } catch (err) {
    next(err);
  }
};

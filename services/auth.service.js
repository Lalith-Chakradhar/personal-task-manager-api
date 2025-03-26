import bcrypt from "bcrypt";

import db from "../models/index.js";

const Users = db.Users;

export const createUserService = async (formData) => {

  const { username, email, password } = formData;

  //Check whether each and every field is present
  if (!username || !email || !password) {
    throw new Error("Missing credentials");
  }

  try {
    //Find user in the db with particular username
    const user = await Users.findOne({ where: { username } });

    //If the user is found, then the username cannot be used. A different username 
    //alongwith email and password has to be created for registration.
    if (user) {
      throw new Error("User already exists");
    }

    //Store the password in the db using bcrypt hashing.
    const encryptedPassword = await bcrypt.hash(password, 10);

    //create new user in the db alongwith hashed password.
    const createdUser = await Users.create({
      username,
      email,
      password: encryptedPassword,
    });

    return createdUser;
  } catch (err) {

    //log and throw error if there was an issue in creating the user in the db.
    console.log("Error in creating the user", err);
    throw err;
  }
};

export const verifyUserService = async (userData) => {

  const { email, password } = userData;

  try {
    //Find user with the particular email id in the db if the db is not empty 
    const user = await Users?.findOne({ where: { email } });

    //If the user is not found, then throw error saying invalid email id
    if (!user) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    //Check password matching
    const isMatch = await bcrypt.compare(password, user.password);

    //If the password does not match, then throw error saying invalid password
    if (!isMatch) {
      const error = new Error("Invalid credentials");
      error.statusCode = 400;
      throw error;
    }

    return user;
  } catch (err) {
    console.log("Error in verifying the user", err);
    throw err;
  }
};

import bcrypt from "bcrypt";

import db from "../models/db";

export const createUserService = async (formData) => {
  //Extract the username, email and password from the request body
  const { username, email, password } = formData;

  //Check whether each and every field is present
  if (!username) {
    throw new Error("Username is required");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  if (!password) {
    throw new Error("Password is required");
  }

  try {
    
    //Find user in the db with particular username
    let queryFindUser = `SELECT * from users where username=$1`;

    const user = await db.oneOrNone(queryFindUser, [username]);

    //If the user is found, then the username cannot be used. A different username 
    //alongwith email and password has to be created for registration.
    if (user) {
      throw new Error("User already exists");
    }

    //Store the password in the db using bcrypt hashing.
    const encryptedPassword = await bcrypt.hash(password, 10);

    //create new user in the db alongwith hashed password.

    let queryInsertUser = 
    `INSERT INTO users 
    (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email;`;

    const createdUser = await db.one(queryInsertUser, [username, email, encryptedPassword]);

    return createdUser;
  } catch (err) {

    //log and throw error if there was an issue in creating the user in the db.
    console.log("Error in creating the user", err);
    throw err;
  }
};

export const verifyUserService = async (userData) => {
  //Extract the email and password from the request body.
  const { email, password } = userData;

  try {
    //Find user with the particular email id in the db.
    let queryFindUser = `SELECT * from users where email=$1`;

    const user = await db.oneOrNone(queryFindUser, [email]);

    //If the user is not found, then throw error saying invalid email id
    if (!user) {
      const error = new Error("Invalid email id");
      error.statusCode = 400;
      throw error;
    }

    //Check password matching
    const isMatch = await bcrypt.compare(password, user.password);

    //If the password does not match, then throw error saying invalid password
    if (!isMatch) {
      const error = new Error("Invalid password");
      error.statusCode = 400;
      throw error;
    }

    return user;
  } catch (err) {
    console.log("Error in verifying the user", err);
    throw err;
  }
};

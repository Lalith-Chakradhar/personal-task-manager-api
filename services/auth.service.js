import bcrypt from "bcrypt";

import db from "../models/index.js";

const Users = db.Users;

export const createUserService = async (formData) => {
  const { username, email, password } = formData;

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
    const user = await Users.findOne({ where: { username } });

    if (user) {
      throw new Error("User already exists");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const createdUser = await Users.create({
      username,
      email,
      password: encryptedPassword,
    });

    return createdUser;
  } catch (err) {
    console.log("Error in creating the user", err);
    throw err;
  }
};

export const verifyUserService = async (userData) => {
  const { email, password } = userData;

  try {
    const user = await Users?.findOne({ where: { email } });

    if (!user) {
      const error = new Error("Invalid email id");
      error.statusCode = 400;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);

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

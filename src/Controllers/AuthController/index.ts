import { Response, Request, NextFunction } from "express";
import { Op, where } from "sequelize";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../../../utils/Error";

const db = require("../../../models");

const { User } = db;

const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    role: user.role, // Include user role here
  };

  const token = jwt.sign(payload, "your_secret_key", { expiresIn: "1h" });
  return token;
};

export const register = async (req: Request, res: Response) => {
  console.log("first");
  try {
    const {
      username,
      address,
      contactNumber,
      email,
      password,
      confirmPassword,
      role,
    } = req.body;

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }],
      },
    });

    //Check existing user
    if (existingUser) {
      return res.status(403).json({
        message: "Email already registered!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //Check the password
    if (password !== confirmPassword) {
      return res.status(403).json({
        password: "Password don't match!",
      });
    }

    const newUser = await User.create({
      username,
      address,
      contactNumber,
      email,
      password: hashedPassword,
      role,
    });

    console.log("new User", newUser);

    res.status(201).json({ message: "User registered successfully" });
  } catch (error: any) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err: any) => ({
        field: err.path,
        message: err.message,
      }));

      return res
        .status(404)
        .json({ message: "Validation error", errors: validationErrors });
    }
    console.error("Error registering user: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Password Don't Match " });
    }

    // Sign the token with the secret
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    // Send the response with the token
    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in: ", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    console.log("profile", userId);
    const userDetails = await User.findOne({
      where: { id: userId },
    });

    return res.status(200).json({
      message: "User Details retrieved successfully.",
      userDetails,
    });
  } catch (error) {
    console.error("Error logging in: ", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, address, contactNumber, email } = req.body;

    // Check if the user exists
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    // Update user details
    user.username = username;
    user.address = address;
    user.contactNumber = contactNumber;
    user.email = email;

    await user.save();

    return res.status(200).json({
      message: "User profile updated successfully.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        address: user.address,
        contactNumber: user.contactNumber,
      },
    });
  } catch (error) {
    console.error("Error updating user profile: ", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

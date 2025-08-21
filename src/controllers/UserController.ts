import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import UserSchema from "../models/User";
import { AuthenticatedRequest } from "../controllers/UserAuthController";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) throw new Error("Missing environment variables");

export const login = async (req: Request, res: Response) => {
  try {
    // Search user by email in DB
    const user = await UserSchema.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid password or email" });
    }

    // Create token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      jwtSecret,
      {
        expiresIn: "30d",
      }
    );

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      user: userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Login error" });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    // Check validation
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }

    // Hash password
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user in DB
    const doc = new UserSchema({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: passwordHash,
    });

    // Save user
    const user = await doc.save();

    // Create token
    const token = jwt.sign(
      {
        _id: user._id,
      },
      jwtSecret,
      {
        expiresIn: "30d",
      }
    );

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json({
      user: userData,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Registration error" });
  }
};

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Search user by ID
    const user = await UserSchema.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json({
      user: userData,
    });
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

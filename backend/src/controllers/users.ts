import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import env from "../util/validateEnv";
import { ObjectId } from "mongoose";

interface SignUpBody {
  username?: string;
  email?: string;
  password?: string;
  _id: ObjectId;
}

interface LoginBody {
  username?: string;
  password?: string;
}

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.cookies.userId).select("+email");
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signUp: RequestHandler<SignUpBody> = async (req, res, next) => {
  const { username, email, password } = req.body;
  const { _id } = req.params;
  const existingUsername = await UserModel.findOne({ username: username });
  const existingEmail = await UserModel.findOne({ email: email });

  try {
    if (!username || !email || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    if (existingUsername) {
      throw createHttpError(
        409,
        "Username already taken. Please choose a different one or log in instead."
      );
    }

    if (existingEmail) {
      throw createHttpError(
        409,
        "A user with this email address already exists. Please log in instead."
      );
    }

    const passwordHashed = await bcrypt.hash(password, 10);

    const newUser = await UserModel.create({
      username: username,
      email: email,
      password: passwordHashed,
    });

    const token = jwt.sign({ _id }, env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    const cookieOptions = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
    };

    res.cookie("jwt", token, cookieOptions);
    res.status(201).json({
      status: "success",
      token,
      newUser,
    });
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler<LoginBody> = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  try {
    if (!username || !password) {
      throw createHttpError(400, "Parameters missing");
    }

    const user = await UserModel.findOne({ username: username })
      .select("+password +email")
      .exec();

    if (!user) {
      throw createHttpError(401, "Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw createHttpError(401, "Invalid credentials");
    }

    req.session.userId = user._id;
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      next(error);
    } else {
      res.sendStatus(200);
    }
  });
};

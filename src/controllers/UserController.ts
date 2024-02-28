import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../models/User';
import generateToken from '../utils/generateToken';

// @Route /api/auth/login
// @Method POST
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(200);
    throw new Error("User not found");
  }

  if (!await user.comparePassword(password)) {
    res.status(200);
    throw new Error("Email or password incorrect");
  }

  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
    },
    token: generateToken(user._id)
  })
})

// @Route /api/auth/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (await User.findOne({ email })) {
    res.status(200);
    throw new Error("User exist");
  }

  const user = new User({
    email,
    password
  });

  await user.save();

  res.status(201).json({
    success: true,
    user: {
      email: user.email,
    },
    token: generateToken(user._id)
  });
})

// @Route /api/user/update
// @Method POST
export const update = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(200);
    throw new Error("User not found");
  }

  await user.save();

  res.status(201).json({
    success: true,
    user: {
      email: user.email
    },
    token: generateToken(user._id)
  });
})
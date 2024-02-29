import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../models/User';
import generateToken from '../utils/generateToken';
import setAuthCookie from '../utils/global';

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

  setAuthCookie({
    res,
    token: generateToken(user._id)
  });
  res.status(200).json({
    success: true,
    user: {
      id: user._id,
      email: user.email,
    }
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

  setAuthCookie({
    res,
    token: generateToken(user._id)
  });
  res.status(201).json({
    success: true,
    user: {
      email: user.email,
    }
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
    }
  });
})
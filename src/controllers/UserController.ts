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
    throw new Error("User not found");
  }

  if (!await user.comparePassword(password)) {
    throw new Error("Password incorrect");
  }

  setAuthCookie({
    res,
    token: generateToken(user)
  });
  res.status(200).json({
    success: true,
    user
  })
})

// @Route /api/auth/register
// @Method POST
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (await User.findOne({ email })) {
    throw new Error("User exist");
  }

  const user = new User({
    email,
    password
  });

  await user.save();

  setAuthCookie({
    res,
    token: generateToken(user)
  });
  res.status(201).json({
    success: true,
    user: user
  });
})

// @Route /api/auth/reset
// @Method POST
export const reset = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const verifyCode = '1111';

  const user = await User.findOneAndUpdate({ email }, {
    verifyCode
  }, {
    new: true
  });

  if (!user) {
    throw new Error("User not found");
  }

  // TODO: SENDING CODE ON EMAIL

  res.status(200).json({
    success: true,
  })
})

// @Route /api/auth/verifyCode
// @Method POST
export const verifyCode = asyncHandler(async (req: Request, res: Response) => {
  const { email, code } = req.body;

  const user = await User.findOneAndUpdate({ email, verifyCode: code }, {
    code: ''
  }, {
    new: true
  });

  if (!user) {
    throw new Error("User not found");
  }

  setAuthCookie({
    res,
    token: generateToken(user)
  });

  res.status(200).json({
    success: true,
    user
  })
})

// @Route /api/auth/changePassword
// @Method POST
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("User not found");
  }

  user.password = password;

  await user.save();

  setAuthCookie({
    res,
    token: generateToken(user)
  });

  res.status(200).json({
    success: true,
    user
  })
})

// @Route /api/user/update
// @Method POST
export const update = asyncHandler(async (req: Request, res: Response) => {
  const {
    gender,
    age,
    height,
    weight,
    weightGoal
  } = req.body;

  const user = await User.findOneAndUpdate({ _id: req.userId }, {
    gender,
    age,
    height,
    weight,
    weightGoal
  }, {
    new: true
  });

  if (!user) {
    throw new Error("User not found");
  }

  setAuthCookie({
    res,
    token: generateToken(user)
  });
  res.status(200).json({
    success: true,
    user
  });
})
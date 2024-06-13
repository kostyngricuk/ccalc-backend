import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User, { IUserJwtPayload } from '../models/User';
import generateToken from '../utils/generateToken';
import setAuthCookie from '../utils/global';
import errorCodes from '../constants/errors';

// @Route /api/auth/login
// @Method POST
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(errorCodes.USER_NOT_FOUND);
  }

  if (!await user.comparePassword(password)) {
    throw new Error(errorCodes.PASSWORD_INCORRECT);
  }

  setAuthCookie({
    res,
    token: generateToken(user as IUserJwtPayload)
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
    throw new Error(errorCodes.USER_EMAIL_EXIST);
  }

  const user = new User({
    email,
    password
  });

  await user.save();

  setAuthCookie({
    res,
    token: generateToken(user as IUserJwtPayload)
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
    throw new Error(errorCodes.USER_NOT_FOUND);
  }

  // TODO: SENDING CODE ON EMAIL

  res.status(200).json({
    success: true,
    user: {
      email
    }
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
    throw new Error(errorCodes.CODE_IS_NOT_VALID);
  }

  setAuthCookie({
    res,
    token: generateToken(user as IUserJwtPayload)
  });

  res.status(200).json({
    success: true,
    user
  })
})
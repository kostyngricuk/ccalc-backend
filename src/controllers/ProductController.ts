import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../models/User';
import generateToken from '../utils/generateToken';
import setAuthCookie from '../utils/global';
import calcDailyLimit from '../utils/calculations';
import errorCodes from '../constants/errors';

// @Route /api/product/update
// @Method POST
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const items = [
    {
      id: 0,
      name: "Milk",
      kkal: 1,
      proto: 2,
      fats: 3,
      carbo: 4
    },
    {
      id: 1,
      name: "Beef",
      kkal: 1,
      proto: 2,
      fats: 3,
      carbo: 4
    },
    {
      id: 2,
      name: "Potato",
      kkal: 1,
      proto: 2,
      fats: 3,
      carbo: 4
    },
  ];

  res.status(200).json({
    success: true,
    items
  });
})

// @Route /api/user/changePassword
// @Method POST
export const changePassword = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new Error(errorCodes.USER_NOT_FOUND);
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

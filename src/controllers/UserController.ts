import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

import User from '../models/User';
import generateToken from '../utils/generateToken';
import setAuthCookie from '../utils/global';
import calcDailyLimit from '../utils/calculations';

// @Route /api/user/update
// @Method POST
export const update = asyncHandler(async (req: Request, res: Response) => {
  const {
    gender,
    age,
    height,
    weight,
    weightGoal,
    oldPassword,
    password,
    email
  } = req.body;

  const user = await User.findOne({ _id: req.userId });
  
  if (!user) {
    throw new Error("User not found" + req.userId);
  }

  if (email) {
    if (await User.findOne({ email })) {
      throw new Error("This email has alredy used");
    }
    user.email = email;
  }

  if (password) {
    if (!await user.comparePassword(oldPassword)) {
      throw new Error("Old password incorrect");
    }
    user.password = password;
  }
  
  user.gender = gender;
  user.age = age;
  user.height = height;
  user.weight = weight;
  user.weightGoal = weightGoal;
  user.calorieWidget = {
    limit: calcDailyLimit({
      height,
      weightGoal,
      age,
      gender
    }),
    eaten: 0,
  };
  
  await user.save();

  setAuthCookie({
    res,
    token: generateToken(user)
  });
  res.status(200).json({
    success: true,
    user
  });
})

// @Route /api/user/changePassword
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

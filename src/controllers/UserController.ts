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
    weightGoal
  } = req.body;

  const user = await User.findOneAndUpdate({ _id: req.userId }, {
    gender,
    age,
    height,
    weight,
    weightGoal,
    calorieWidget: {
      limit: calcDailyLimit({
        height,
        weightGoal,
        age,
        gender
      }),
      eaten: 0,
    },
  }, {
    new: true
  });

  if (!user) {
    throw new Error("User not found" + req.userId);
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
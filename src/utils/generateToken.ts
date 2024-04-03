import jwt from "jsonwebtoken";
import { IUserJwtPayload } from "../models/User";

const generateToken = (user: IUserJwtPayload) => {
  const {
    _id,
    gender,
    age,
    height,
    weight,
    weightGoal,
    email,
    calorieWidget
  } = user;
  const token = jwt.sign({
    _id,
    gender,
    age,
    height,
    weight,
    weightGoal,
    email,
    calorieWidget
  }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
  return token;
};

export default generateToken;
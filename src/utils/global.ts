import { Request, Response } from 'express';
import dayjs from "dayjs";

const setAuthCookie = ({
  res,
  token
}: {
  res: Response,
  token: string
}) => {
  res.cookie("e-access-token", token, {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: false,
    expires: dayjs().add(30, "days").toDate(),
    signed: true
  });
}

export default setAuthCookie;
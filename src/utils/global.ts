import { Request, Response } from 'express';
import dayjs from "dayjs";


const setAuthCookie = ({
  res,
  token
}: {
  res: Response,
  token: string
}) => {
  res.cookie("auth", JSON.stringify({
    token
  }), {
    secure: process.env.NODE_ENV !== "development",
    httpOnly: true,
    expires: dayjs().add(30, "days").toDate(),
  });
}

export default setAuthCookie;
import { Request, Response } from "express";

export const sessionUser = () => {
  return async (req: Request, res: Response) => {
    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];
    const payload = {};
  };
};

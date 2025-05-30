import jwt from "jsonwebtoken";
import config from '../config';
import User from "../models/user.model";
import { UserPayload } from "../interfaces/user-payload.interface";


export const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, role: user.role }, config.app.jwtSecret || '', {
    expiresIn: "1h"
  });
};

export const verifyToken = (token: string): UserPayload => {
  return jwt.verify(token, config.app.jwtSecret || '') as UserPayload;
};
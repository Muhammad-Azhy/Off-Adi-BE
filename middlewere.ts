import jwt from "jsonwebtoken";
import { Request , Response, NextFunction } from "express";
function verifyToken(req:Request, res:Response, next:NextFunction) {
  // Get the token from the request headers
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  jwt.verify(token,"jdbvudfge", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    (req as any).decodedToken = decoded;
    next();
  });
}
export {verifyToken}
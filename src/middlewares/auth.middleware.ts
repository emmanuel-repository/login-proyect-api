import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils';
import Session from '../models/session.model';
import { UserPayload } from '../interfaces/user-payload.interface';


export class AuthMiddleware {

  static async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {

    try {

      const authHeader = req.headers.authorization;

      if (!authHeader) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
      }

      const token = authHeader.split(' ')[1];

      const decoded = verifyToken(token);

      (req as Request & { user: UserPayload }).user = decoded;

      const session = await Session.findOne({ where: { user_id: decoded.id } });
      const now = new Date();

      if (!session) {
        res.status(403).json({ message: 'Sesion no encontrada' });
        return;
      }

      const lastActivity = new Date(session.last_activity_time);
      const diff = (now.getTime() - lastActivity.getTime()) / 1000;

      if (diff > 10) {
        await session.destroy();
        res.status(440).json({ message: 'Sesion expiro por Inactividad' });
        return;
      }

      session.last_activity_time = now;

      await session.save();

      next();

    } catch (err) {
      res.status(401).json({ message: 'Token Invalido' });
    }
  }

}
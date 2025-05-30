import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt.utils';
import Session from '../models/session.model';

export default class AuthController {

  static async signIn(req: Request, res: Response): Promise<any> {
    try {

      const { email, password } = req.body;
      const user = await User.findOne({ where: { email: email } });

      if (!user) {
        return res.status(401).json({ message: 'Credenciales Invalidas' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return res.status(401).json({ message: 'Credenciales Invalidas' });
      }

      const token: string = generateToken(user);

      await Session.create({
        user_id: user.id,
        start_time: new Date(),
        last_activity_time: new Date()
      });

      const { id, email: userEmail, full_name: name, role: userRole } = user.get({ plain: true });

      return res.status(200).json({ token: token, id, email, name, userRole });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async signUp(req: Request, res: Response): Promise<any> {
    try {
      const { email, password, full_name } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) return res.status(409).json({ message: 'User already exists' });

      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        email,
        password_hash: hashedPassword,
        full_name,
        role: 'standard'
      });

      return res.status(201).json({ message: 'User created successfully' });

    } catch (error) {
      console.error('Error in signUp:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async signOut(req: Request, res: Response): Promise<any> {
    try {

      const { id } = req.params;

      const session = await Session.findOne({ where: { user_id: id }, order: [['start_time', 'DESC']] });

      if (!session) return res.status(404).json({ message: 'No se encontró ninguna sesión activa' });

      await session.destroy();

      return res.status(200).json({ message: 'Cierre de sesión exitoso' });

    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

}
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';


export default class UserController {

  static async getAllRegistrer(req: Request, res: Response): Promise<any> {
    try {

      const users = await User.findAll({
        where: { role: "standard" },
        attributes: ['id', 'full_name', 'email', 'role']
      });

      return res.status(200).json(users);

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getRegisterById(req: Request, res: Response): Promise<any> {
    try {

      const { id } = req.params;
      const user = await User.findByPk(id, { attributes: ['id', 'full_name', 'email', 'role'] });

      if (!user) return res.status(404).json({ message: 'Recurso no encontrado' });

      return res.status(200).json(user);

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createRegister(req: Request, res: Response): Promise<any> {
    try {

      const { email, password, full_name, role } = req.body;
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) return res.status(409).json({ message: 'El usuario ya existe' });

      const password_hash = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password_hash, full_name, role });
      const { id, email: userEmail, full_name: name, role: userRole } = user.get({ plain: true });

      res.status(201).json({ id, email: userEmail, full_name: name, role: userRole });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateRegister(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { full_name, email, role } = req.body;

      const user = await User.findByPk(id);

      if (!user) return res.status(404).json({ message: 'User not found' });

      const emailTaken = await User.findOne({ where: { email } });

      if (emailTaken && emailTaken.id !== user.id) return res.status(400).json({ message: 'El usuario ya existe' });

      await user.update({ full_name, email, role });

      return res.json({ id: user.id, full_name, email, role });

    } catch (error) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteRegister(req: Request, res: Response): Promise<any> {
    try {

      const { id } = req.params;
      const user = await User.findByPk(id);

      if (!user) return res.status(404).json({ message: 'No encontrado' });

      await user.destroy();

      res.json({ id: user.id });

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updatePasswordUpdate(req: Request, res: Response): Promise<any> {
    try {
      
      const { id, oldPassword, newPassword } = req.body;

      const user = await User.findByPk(id);

      if (!user) return res.status(404).json({ message: 'No encontrado' });

      const isMatch = await bcrypt.compare(oldPassword, user.password_hash);

      if (!isMatch) return res.status(441).json({ message: 'Contraseña anterior no coincide' });
      
      const password_hash = await bcrypt.hash(newPassword, 10);

      await user.update({ password_hash });

      return res.json({ id: user.id, message: "Se actualizo la contraseña correctamente"});

    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

}
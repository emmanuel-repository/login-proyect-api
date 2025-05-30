import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import { createUserSchema, updateUserPasswordSchema, updateUserSchema } from "../interfaces/user.interface";

const router = Router()

router.get('/user', AuthMiddleware.authenticate, UserController.getAllRegistrer);
router.get('/user/:id', AuthMiddleware.authenticate, UserController.getRegisterById);
router.post('/user', validate(createUserSchema), AuthMiddleware.authenticate, UserController.createRegister);
router.post('/user/editPassword', validate(updateUserPasswordSchema), AuthMiddleware.authenticate, UserController.updatePasswordUpdate);
router.put('/user/:id', validate(updateUserSchema) ,AuthMiddleware.authenticate, UserController.updateRegister);
router.delete('/user/:id', AuthMiddleware.authenticate, UserController.deleteRegister);

export default router;
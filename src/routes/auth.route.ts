import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import { signInSchema, signUpSchema } from "../interfaces/signIn.interface";

const router = Router();

router.post('/signIn', validate(signInSchema), AuthController.signIn);
router.post('/signUp', validate(signUpSchema), AuthController.signUp);
router.get('/signOut/:id', AuthController.signOut);

export default router;
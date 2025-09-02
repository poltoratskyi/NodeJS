import { Router } from "express";
import { login, register, getUser } from "../controllers/UserController";
import { userAuthController } from "../controllers/UserAuthController";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.get("/user", userAuthController, getUser);

export default router;

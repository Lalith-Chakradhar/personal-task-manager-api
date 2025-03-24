import { Router } from "express";

import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = Router();

//Register and login users with post requests containing user details
router.post("/register", registerUser);

router.post("/login", loginUser);

export default router;

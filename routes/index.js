import express from "express";

import authRoute from "./auth.route.js";
import taskRoute from "./task.route.js";

const router = express.Router();

//Use the auth and tasks routes
router.use("/auth", authRoute);
router.use("/tasks", taskRoute);

export default router;

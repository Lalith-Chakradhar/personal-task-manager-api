import { Router } from "express";

import { jwtAuthMiddleware } from "../middlewares/auth.js";

import {
  getAllTasksOfUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = Router();

//Get request to fetch all user tasks. Before this, the user is verfied using jwtAuthMiddleware.
router.get("/", jwtAuthMiddleware, getAllTasksOfUser);

//Get request to fetch one task by its id.
router.get("/:id", jwtAuthMiddleware, getTaskById);

//Post request to create a task with task details in the request body
router.post("/", jwtAuthMiddleware, createTask);

//Put request to update the task with particular id.
router.put("/:id", jwtAuthMiddleware, updateTask);

//Delete request to delete the task with particular id.
router.delete("/:id", jwtAuthMiddleware, deleteTask);

export default router;

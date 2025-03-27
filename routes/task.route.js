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

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *         - priority
 *         - dueDate
 *         - status
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the task
 *         title:
 *           type: string
 *           description: The title of the task
 *         description:
 *           type: string
 *           description: A detailed description of the task
 *         priority:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *           description: The priority of the task
 *         dueDate:
 *           type: string
 *           format: date-time
 *           description: The due date of the task
 *         status:
 *           type: string
 *           enum:
 *             - pending
 *             - completed
 *           description: The completion status of the task
 *       example:
 *         id: 1
 *         title: Task 1
 *         description: Implement swagger documentation
 *         priority: high
 *         dueDate: "2025-06-01"
 *         status: pending
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks for a user
 *     description: Fetch all tasks of a user with optional filters
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: title
 *         in: query
 *         description: "Filter tasks by title. Supports partial matching."
 *         required: false
 *         schema:
 *           type: string
 *       - name: priority
 *         in: query
 *         description: "Filter tasks by priority."
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - low
 *             - medium
 *             - high
 *       - name: status
 *         in: query
 *         description: "Filter tasks by status."
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - pending
 *             - completed
 *       - name: dueDateStart
 *         in: query
 *         description: "Filter tasks by start date of the dueDate range (inclusive)."
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - name: dueDateEnd
 *         in: query
 *         description: "Filter tasks by end date of the dueDate range (inclusive)."
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - name: sortBy
 *         in: query
 *         description: "Sort the tasks by a field."
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - dueDate
 *             - priority
 *       - name: sortOrder
 *         in: query
 *         description: "Sort order for sorting tasks (ascending or descending)."
 *         required: false
 *         schema:
 *           type: string
 *           enum:
 *             - ASC
 *             - DESC
 *         default: "ASC"
 *       - name: page
 *         in: query
 *         description: "The page number for pagination (default is 1)."
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         description: "The number of tasks per page (default is 10)."
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tasks:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 *                 totalTasks:
 *                   type: integer
 *                   description: "The total number of tasks that match the filters."
 *                 currentPage:
 *                   type: integer
 *                   description: "The current page number."
 *                 totalPages:
 *                   type: integer
 *                   description: "The total number of pages based on the limit and total tasks."
 *       400:
 *         description: Invalid filter parameters.
 *       500:
 *         description: Internal server error.
 */
//Get request to fetch all user tasks. Before this, the user is verfied using jwtAuthMiddleware.
router.get("/", jwtAuthMiddleware, getAllTasksOfUser);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     description: Fetch a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "The ID of the task"
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: "Successfully retrieved task"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: "Task not found"
 *       500:
 *         description: "Internal server error"
 */
//Get request to fetch one task by its id.
router.get("/:id", jwtAuthMiddleware, getTaskById);

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     description: Create a task with specified details
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: "Task created successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: "Invalid request body"
 *       500:
 *         description: "Internal server error"
 */
//Post request to create a task with task details in the request body
router.post("/", jwtAuthMiddleware, createTask);

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     description: Update the details of a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "The ID of the task"
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: "Task updated successfully"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: "Invalid request body"
 *       404:
 *         description: "Task not found"
 *       500:
 *         description: "Internal server error"
 */
//Put request to update the task with particular id.
router.put("/:id", jwtAuthMiddleware, updateTask);

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     description: Delete a task by its ID
 *     tags: [Tasks]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: "The ID of the task"
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: "Task deleted successfully"
 *       404:
 *         description: "Task not found"
 *       500:
 *         description: "Internal server error"
 */
//Delete request to delete the task with particular id.
router.delete("/:id", jwtAuthMiddleware, deleteTask);

export default router;

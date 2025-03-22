import {Router} from 'express';

import {jwtAuthMiddleware} from '../middlewares/auth.js';

import {getAllTasksOfUser, getTaskById, createTask, updateTask, deleteTask} from '../controllers/task.controller.js';

const router = Router();


router.get('/', jwtAuthMiddleware, getAllTasksOfUser);

router.get('/:id', jwtAuthMiddleware, getTaskById);

router.post('/', jwtAuthMiddleware, createTask);

router.put('/:id', jwtAuthMiddleware, updateTask);

router.delete('/:id', jwtAuthMiddleware, deleteTask);


export default router;
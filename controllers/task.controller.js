import {
  createTaskService,
  fetchAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service.js";

export const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    const task = await createTaskService(userId, data);

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasksOfUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const filters = req.query;

    const filteredTasks = await fetchAllTasksService(userId, filters);

    res
      .status(200)
      .json({ message: "Fetched the tasks successfully", filteredTasks });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const task = await getTaskByIdService(userId, taskId);

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const taskData = req.body;

    const modifiedTask = await updateTaskService(userId, taskId, taskData);

    res
      .status(200)
      .json({ message: "Task updated successfully", modifiedTask });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const nowDeletedTask = await deleteTaskService(userId, taskId);

    res
      .status(200)
      .json({ message: "Task deleted successfully", nowDeletedTask });
  } catch (error) {
    next(error);
  }
};

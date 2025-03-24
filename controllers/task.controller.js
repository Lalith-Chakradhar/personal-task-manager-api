import winston from "winston";
import {
  createTaskService,
  fetchAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service.js";
import "./loggers.js";

const infoLogger = winston.loggers.get("infoLogger");
const errorLogger = winston.loggers.get("errorLogger");

export const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // Log the task creation request
    infoLogger.info("Task creation request received", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskData: data,
    });

    //create a task in db with a particular user id and data
    const task = await createTaskService(userId, data);

    res.status(201).json({ message: "Task created successfully", task });

    // Log the successful task creation
    infoLogger.info("Task created successfully", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: task.id,
      taskTitle: task.title,
    });
  } catch (error) {
    // Log the error before passing it to the next middleware
    errorLogger.error("Task creation failed", {
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      userId: req.user.id,
    });

    next(error);
  }
};

export const getAllTasksOfUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    //Acquire the optional filters from the query parameters
    const filters = req.query;

    // Log the tasks fetch request with filters
    infoLogger.info("Fetching tasks for user", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      filters: filters,
    });

    //fetch all tasks from the db using the user specified filters for a particular user.
    const filteredTasks = await fetchAllTasksService(userId, filters);

    //Send a response with all tasks of the user according to the specified filters
    res
      .status(200)
      .json({ message: "Fetched the tasks successfully", filteredTasks });
    
    // Log the successful task fetching
    infoLogger.info("Tasks fetched successfully", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskCount: filteredTasks.totalTasks,
    });

  } catch (error) {
    errorLogger.error("Failed to fetch tasks", {
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      userId: req.user.id,
    });

    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // Log the task fetch by ID request
    infoLogger.info("Fetching task by ID", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: taskId,
    });

    //Get task of a particular user by the task id
    const task = await getTaskByIdService(userId, taskId);

    // Log the successful task fetch by ID
    infoLogger.info("Task fetched successfully by ID", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: task.id,
      taskTitle: task.title,
    });

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    
    errorLogger.error("Failed to fetch task by ID", {
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      userId: req.user.id,
      taskId: req.params.id,
    });

    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const taskData = req.body;

    // Log the task update request
    infoLogger.info("Task update request received", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: taskId,
      updatedData: taskData,
    });

    //Update the task with modified data for a particular user using their id
    const modifiedTask = await updateTaskService(userId, taskId, taskData);

    // Log the successful task update
    infoLogger.info("Task updated successfully", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: modifiedTask.id,
      taskTitle: modifiedTask.title,
    });

    res
      .status(200)
      .json({ message: "Task updated successfully", modifiedTask });
  } catch (error) {
    
    errorLogger.error("Failed to update task", {
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      userId: req.user.id,
      taskId: req.params.id,
    });

    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    // Log the task delete request
    infoLogger.info("Task delete request received", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: taskId,
    });

    //Delete a task with specified ID for a particular user 
    const nowDeletedTask = await deleteTaskService(userId, taskId);

    res
      .status(204)
      .json({ message: "Task deleted successfully", nowDeletedTask });

    // Log the successful task deletion
    infoLogger.info("Task deleted successfully", {
      method: req.method,
      url: req.originalUrl,
      userId: userId,
      taskId: nowDeletedTask.id,
      taskTitle: nowDeletedTask.title,
    });
  } catch (error) {
    
    errorLogger.error("Failed to delete task", {
      error: error.message,
      stack: error.stack,
      requestMethod: req.method,
      requestUrl: req.originalUrl,
      userId: req.user.id,
      taskId: req.params.id,
    });
    
    next(error);
  }
};

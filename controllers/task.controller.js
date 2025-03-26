import {
  createTaskService,
  fetchAllTasksService,
  getTaskByIdService,
  updateTaskService,
  deleteTaskService,
} from "../services/task.service.js";
import logger from "../utils/logger.js";

export const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const data = req.body;

    // Log the task creation request
    logger.info("Task creation request received",
      { reqMethod: req.method, reqUrl: req.originalUrl });

    //create a task in db with a particular user id and data
    const task = await createTaskService(userId, data);

    res.status(201).json({ message: "Task created successfully", task });

    // Log the successful task creation
    logger.info("Task created successfully",
      { reqMethod: req.method, reqUrl: req.originalUrl });
  
  } catch (error) {
    // Log the error before passing it to the next middleware
    logger.error("Task creation failed", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: error.stack,
    });

    next(error);
  }
};

export const getAllTasksOfUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    //Acquire the optional filters from the query parameters
    const filters = req.query;

    logger.info("Fetching tasks for user",
      { reqMethod: req.method, reqUrl: req.originalUrl });

    //fetch all tasks from the db using the user specified filters for a particular user.
    const filteredTasks = await fetchAllTasksService(userId, filters);

    //Send a response with all tasks of the user according to the specified filters
    res
      .status(200)
      .json({ message: "Fetched the tasks successfully", filteredTasks });
    
    logger.info("Tasks fetched successfully",
      { reqMethod: req.method, reqUrl: req.originalUrl });
    
  } catch (error) {

    logger.error("Failed to fetch tasks", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: error.stack,
    });

    next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    logger.info("Fetching task by ID",
      { reqMethod: req.method, reqUrl: req.originalUrl });
   
    //Get task of a particular user by the task id
    const task = await getTaskByIdService(userId, taskId);

    logger.info("Task fetched successfully by ID",
      { reqMethod: req.method, reqUrl: req.originalUrl });

    res.status(200).json({ message: "Task fetched successfully", task });
  } catch (error) {
    
    logger.error("Failed to fetch task by ID", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: error.stack,
    });

    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    const taskData = req.body;

    logger.info("Task update request received",
      { reqMethod: req.method, reqUrl: req.originalUrl });

    //Update the task with modified data for a particular user using their id
    const modifiedTask = await updateTaskService(userId, taskId, taskData);

    logger.info("Task updated successfully",
      { reqMethod: req.method, reqUrl: req.originalUrl });

    res
      .status(200)
      .json({ message: "Task updated successfully", modifiedTask });
  } catch (error) {
    
    logger.error("Failed to update task", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: error.stack,
    });

    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const taskId = req.params.id;

    logger.info("Task delete request received",
      { reqMethod: req.method, reqUrl: req.originalUrl });

    //Delete a task with specified ID for a particular user 
    const nowDeletedTask = await deleteTaskService(userId, taskId);

    res
      .status(204)
      .json({ message: "Task deleted successfully", nowDeletedTask });

    logger.info("Task deleted successfully",
      { reqMethod: req.method, reqUrl: req.originalUrl });
   
  } catch (error) {
    
    logger.error("Failed to delete task", {
      reqMethod: req.method, reqUrl: req.originalUrl, stack: error.stack,
    });
    
    next(error);
  }
};

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

    //create a task in db with a particular user id and data
    const task = await createTaskService(userId, data);

    res.status(201).json({ message: "Task created successfully", task });
  } catch (error) {
    next(error);
  }
};

export const getAllTasksOfUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    //Acquire the optional filters from the query parameters
    const filters = req.query;

    //fetch all tasks from the db using the user specified filters for a particular user.
    const filteredTasks = await fetchAllTasksService(userId, filters);

    //Send a response with all tasks of the user according to the specified filters
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

    //Get task of a particular user by the task id
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

    //Update the task with modified data for a particular user using their id
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

    //Delete a task with specified ID for a particular user 
    const nowDeletedTask = await deleteTaskService(userId, taskId);

    res
      .status(204)
      .json({ message: "Task deleted successfully", nowDeletedTask });
  } catch (error) {
    next(error);
  }
};

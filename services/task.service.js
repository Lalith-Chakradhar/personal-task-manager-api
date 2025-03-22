import db from "../models/index.js";
import { Op } from "sequelize";

const Tasks = db.Tasks;

export const createTaskService = async (userId, taskData) => {
  validateTaskBeforeCreateOrUpdate(taskData);

  try {
    const task = await Tasks.create({
      ...taskData,
      userId,
    });

    return task;
  } catch (err) {
    console.log("Error in creating the user", err);
    throw err;
  }
};

export const fetchAllTasksService = async (userId, filters) => {
  try {
    const {
      title,
      priority,
      status,
      dueDateStart,
      dueDateEnd,
      sortBy,
      sortOrder = "ASC",
      page = 1,
      limit = 10,
    } = filters;

    //Dynamically construct filter and sort options based on their availability
    const whereClause = {
      userId: userId,
    };

    if (title) {
      whereClause.title = { [Op.like]: `%${title}%` };
    }

    if (priority) {
      whereClause.priority = priority;
    }

    if (status) {
      whereClause.status = status;
    }

    if (dueDateStart && dueDateEnd) {
      whereClause.dueDate = {
        [Op.between]: 
        [new Date(dueDateStart), new Date(dueDateEnd)], //get all dueDates between this range
      };
    } else if (dueDateStart) {
      //when only dueDateStart is provided
      whereClause.dueDate = 
      { [Op.gte]: new Date(dueDateStart) }; // get all due dates greater than dueDateStart
    } else if (dueDateEnd) {
      //when only dueDateEnd is provided
      whereClause.dueDate = 
      { [Op.lte]: new Date(dueDateEnd) }; // get all due dates less than dueDateEnd
    }

    let pageInt = parseInt(page);
    let limitInt = parseInt(limit);

    const offset = (pageInt - 1) * limitInt;

    let order = [];

    if (
      sortBy &&
      (sortBy === "dueDate" || sortBy === "priority") &&
      (sortOrder.toUpperCase === "ASC" || sortOrder.toUpperCase === "DESC")
    ) {
      order.push([sortBy, sortOrder.toUpperCase()]);
    }

    const result = await Tasks.findAndCountAll({
      where: whereClause,
      limit: limitInt,
      offset: offset,
      order: order.length > 0 ? order : undefined,
    });

    const resultObject = {
      tasks: result.rows,
      totalTasks: result.count,
      currentPage: pageInt,
      totalPages: Math.ceil(result.count / limitInt),
    };

    return resultObject;
  } catch (error) {
    console.log("Error fetching tasks", error);
    throw error;
  }
};

export const getTaskByIdService = async (userId, taskId) => {
  try {
    const task = await Tasks.findOne({
      where: {
        id: taskId,
        userId: userId,
      },
    });

    if (!task) {
      throw new Error("Task not found for the specified user");
    }

    return task;
  } catch (error) {
    console.error("Error finding task:", error);
    throw error;
  }
};

const validateTaskBeforeCreateOrUpdate = (taskData) => {
  const { title, description, priority, dueDate, status } = taskData;

  if (!title) {
    throw new Error("Title is not provided");
  } else if (!description) {
    throw new Error("Description is not provided");
  } else if (!priority) {
    throw new Error("Priority is not provided");
  } else if (!dueDate) {
    throw new Error("Task dueDate is not provided");
  } else if (!status) {
    throw new Error("Task status is not provided");
  }
};

export const updateTaskService = async (userId, taskId, taskData) => {
  validateTaskBeforeCreateOrUpdate(taskData);

  try {
    const result = await Tasks.update(taskData, {
      where: {
        id: taskId,
        userId: userId,
      },
    });

    const updatedRowsCount = result[0];

    if (updatedRowsCount === 0) {
      throw new Error("No task found with the provided taskId and userId.");
    }

    return await getTaskByIdService(userId, taskId);
  } catch (error) {
    console.log("Error in updating the task");
    throw error;
  }
};

export const deleteTaskService = async (userId, taskId) => {
  try {
    const task = await getTaskByIdService(userId, taskId);

    await task.destroy();

    return task;
  } catch (error) {
    console.log("Error in deleting the task");
    throw error;
  }
};

import db from "../models/db.js";

export const createTaskService = async (userId, taskData) => {
  validateTaskBeforeCreateOrUpdate(taskData);

  const { title, description, priority, dueDate, status } = taskData;

  try {
    //Create task in the db for the particular user
    let queryInsertTask = 
    `INSERT INTO tasks 
    (title, description, priority, dueDate, status, userId) VALUES ($1, $2, $3, $4, $5, $6) 
    RETURNING id, title, description, priority, dueDate, status, userId, createdAt;`;

    const createdTask = await db.one(queryInsertTask, 
      [ title, description, priority, dueDate, status, userId ]);

    return createdTask;
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
    let whereClause = ` WHERE userId = $1`;

    const queryParams = [userId];

    if (title) {

      whereClause += ` AND title LIKE $${queryParams.length + 1}`;
      queryParams.push(`%${title}%`);

    }

    if (priority) {

      whereClause += ` AND priority = $${queryParams.length + 1}`;
      queryParams.push(priority);

    }

    if (status) {

      whereClause += ` AND status = $${queryParams.length + 1}`;
      queryParams.push(status);

    }

    if (dueDateStart && dueDateEnd) {
      
      //get all dueDates between this range
      whereClause += 
      ` AND dueDate BETWEEN $${queryParams.length + 1} AND $${queryParams.length + 2}`;
      
      queryParams.push(dueDateStart.split('T')[0], dueDateEnd.split('T')[0]); 

    } else if (dueDateStart) {
      
      //when only dueDateStart is provided, get all due dates greater than dueDateStart
      whereClause += ` AND dueDate >= $${queryParams.length + 1}`;

      queryParams.push(dueDateStart.split('T')[0]); 

    } else if (dueDateEnd) {

      //when only dueDateEnd is provided, get all due dates less than dueDateEnd
      whereClause += ` AND dueDate <= $${queryParams.length + 1}`;
      queryParams.push(dueDateEnd.split('T')[0]);

    }

    //Provide pagination details like current page and limit of records in each page
    let pageInt = parseInt(page);
    let limitInt = parseInt(limit);

    const offset = (pageInt - 1) * limitInt;

    let orderClause = "";

    //Only push sorting details array, if there is sortBy param, and sortBy and sortOrder 
    //have valid values
    if (
      sortBy &&
      (sortBy === "dueDate" || sortBy === "priority") &&
      (sortOrder.toUpperCase() === "ASC" || sortOrder.toUpperCase() === "DESC")
    ) {
      
      if (sortBy === "priority") {
        orderClause = `ORDER BY 
          CASE 
            WHEN priority = 'low' THEN 1 
            WHEN priority = 'medium' THEN 2 
            WHEN priority = 'high' THEN 3 
            ELSE 4
          END ${sortOrder.toUpperCase()}`;
      } 
      else {
        //For Dates
        orderClause = `ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`;
      }

    }

    //find all and count the tasks of the user based on the filters and sort order
    const queryCount = `SELECT COUNT(*) FROM tasks ${whereClause};`;

    const queryTasks = `
      SELECT id, title, description, priority, dueDate, status, createdAt, updatedAt
      FROM tasks 
      ${whereClause} 
      ${orderClause} 
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
    `;

    queryParams.push(limitInt, offset);

    const totalTasksCount = await db.one(queryCount, queryParams);

    const tasks = await db.any(queryTasks, queryParams);

    const resultObject = {
      tasks,
      totalTasks: totalTasksCount.count,
      currentPage: pageInt,
      totalPages: Math.ceil(totalTasksCount.count / limitInt),
    };

    return resultObject;
  } catch (error) {
    console.log("Error fetching tasks", error);
    throw error;
  }
};

export const getTaskByIdService = async (userId, taskId) => {
  try {

    //Find task of particular user with task id
    const queryFind = `
      SELECT id, title, description, priority, dueDate, status, userId, createdAt, updatedAt
      FROM tasks
      WHERE id = $1 AND userId = $2;
    `;

    const task = await db.oneOrNone(queryFind, [taskId, userId]);

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

  //Check all the fields are present before updating or creating a task in the db
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

  const { title, description, priority, dueDate, status } = taskData;

  try {

    //Update task of particular user with task Id and task details
    const queryUpdate = `
    UPDATE tasks
    SET title = $1, description = $2, priority = $3, dueDate = $4, status = $5
    WHERE id = $6 AND userId = $7
    RETURNING id, title, description, priority, dueDate, status, updatedAt;
  `;

    const result = await db.one(queryUpdate, 
      [title, description, priority, dueDate, status, taskId, userId]);

    return result;
  } catch (error) {
    console.log("Error in updating the task");
    throw error;
  }
};

export const deleteTaskService = async (userId, taskId) => {
  try {
    
    //Destroy the task in the db
    const queryDelete = `DELETE FROM tasks WHERE id = $1 AND userId = $2 RETURNING *;`;
    const deletedTask = await db.one(queryDelete, [taskId, userId]);

    return deletedTask;
  } catch (error) {
    console.log("Error in deleting the task");
    throw error;
  }
};

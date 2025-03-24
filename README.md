# Personal Task Manager API

A server containing APIs used for managing users and tasks.

## Description

This project provides APIs to register and login users, to create, update and delete tasks of a particular user and fetch all the tasks of the user. The project is built using **Node.js**, **Express.js**, and **Sequelize ORM** with a **MySQL** database.

## Features

1. **User Registration** - Register user with the username, email and password. Only unique usernames are allowed.
2. **User Login** - Login user with email and password. Only registered users can login.
   
**Only when user is logged in:**
1. **Create Task** - Create a task for a particular user.
2. **Fetch All Tasks with additional filters and sort order** - Fetch all tasks of the user based on specified filters like title, priority, dueDate range etc, and sort the task order on the basis of dueData or priority. 
3. **Update Task** - Update task details.
4. **Delete Task** - Delete a task.

## Installation

1. Clone the repo and install dependencies -

```bash

git clone https://github.com/Lalith-Chakradhar/personal-task-manager-api.git
cd personal-task-manager-api
npm install

```

2. Create a '.env' file and provide the following details -

```.env

DB_USER=your_database_username
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
DB_HOST=your_database_host (usually localhost for local setups)
DB_PORT=your_database_port (Default for MySQL port is 3306)
PORT=your_server_port
JWT_SECRET=your_jwt_secret_key

```

1. Start the server by running - 
   
```bash

node app.js

```
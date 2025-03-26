import express from "express";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.js";
import config from "./config/config.js";
import morganLogger from "morgan";

import swaggerjsdoc from "swagger-jsdoc";
import swaggerui from "swagger-ui-express";

const app = express();

//Whatever request body is received, it is automatically parsed from JSON to Javascript object
app.use(express.json());

app.use(morganLogger("dev"));

//Use all the routes
app.use("/", routes);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Personal Task Manager API docs",
      version: "1.0.0",
      description:
      "A server containing APIs used for managing users and tasks, and documented with Swagger",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["./routes/*.js"],  // Look for API documentation comments in all route files
};

const swaggerSpecs = swaggerjsdoc(options);

app.use(
  "/api-docs",
  swaggerui.serve,
  swaggerui.setup(swaggerSpecs),
);

//Use the errorHandler after the routes such that on doing a next call,
//the errorHandler middleware is called
app.use(errorHandler);

//Run the server on a specific port number
const port = config.port;

//Run the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

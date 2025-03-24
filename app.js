import express from "express";
import routes from "./routes/index.js";
import errorHandler from "./middlewares/error.js";
import config from "./config/config.js";

const app = express();

//Whatever request body is received, it is automatically parsed from JSON to Javascript object
app.use(express.json());

//Use all the routes
app.use("/", routes);

//Use the errorHandler after the routes such that on doing a next call,
//the errorHandler middleware is called
app.use(errorHandler);

//Run the server on a specific port number
const port = config.port;

//Run the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

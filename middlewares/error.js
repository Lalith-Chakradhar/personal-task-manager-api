const errorHandler = (err, _, res) => {
  
  //Extract the status code and message from the error received
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";

  //Send response with status code and error message
  res.status(statusCode).json({
    code: statusCode,
    error: {
      message,
    },
  });
};

export default errorHandler;

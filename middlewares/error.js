const errorHandler = (err,req,res) => {
    
    console.log(res);
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';


    res.status(statusCode).json({
        code: statusCode,
        error: {
            message,
        },
    });
};



export default errorHandler;
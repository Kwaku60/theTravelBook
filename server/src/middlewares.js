
//not found middleware for routes that don't exist and are requested
//serve up 404 and message
const notFound = (req, res, next) => {   
    const error = new Error('Not Found = ${req.originalUrl}');
    res.status(404);
    next(error);
}


//error handling middleware requres four parameters, but we don't need 'next' here
//eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) =>{
    //if we end up with a 200 in the end, make code 500, otherwise use original status code
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        //**remove on production the stack trace message
        message: error.message,
        //speciy stack trace (only if we're not on production)
        stack: process.env.NODE_ENV === 'production' ? 'x' : error.stack,
    });
}

module.exports = {
    notFound,
    errorHandler
};
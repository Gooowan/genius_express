const logger = require('./logger');

const errorHandler = (err, req, res, next) => {
    console.log(1)
    let response = {
        statusCode: 500,
        message: 'Internal Server Error',
        details: err.message
    };

    if (err.name === 'CastError') {
        response.statusCode = 400;
        response.message = err.path === '_id' ?
            `Invalid ID format: ${err.stringValue}. Expected an ObjectId.` :
            'Invalid input data.';
    }
    if (err.name.startsWith('Failed to load resource')) {
        response.statusCode = 400;
        response.message = 'Failed to load resource';
    }


    logger.error(`${err.name}: ${err.message}`);
    res.status(response.statusCode).json({ error: response.message, details: response.details });
};

module.exports = errorHandler;

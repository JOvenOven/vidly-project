const winston = require('winston');
// require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    // Logging uncaught exceptions
    winston.exceptions.handle(
        new winston.transports.Console({ 
            level: 'error',
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.json(),
                winston.format.simple()
        )}),
        new winston.transports.File({ filename: 'uncaughtExceptions.log'}));

    // Logging route-handler exceptions
    winston.add(new winston.transports.File({ filename: 'logfile.log'}));
    // winston.add(new winston.transports.MongoDB({ 
    //     db: 'mongodb://127.0.0.1/vidlyDB',
    //     level: 'error'
    // }));
}


import { NextFunction, Response } from 'express';
import logging from '../library/logging';
const AppError = require('../middleware/appError');
const handleCastErrorDB = (err: AppError) => {
    const message = `Invalid ${err.path}:${err.value}.`;
    return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err: AppError) => {
    const value = err.message?.match(/(?<=(["']))(?:(?=(\\?))\2.)*?(?=\1)/);
    const message = `Duplicate field ${value![0]}. Please use another value.`;
    return new AppError(message, 400);
};
const handleValidationErrorDB = (err: AppError) => {
    const errors = Object.values(err.errors!).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(', ')}`;
    return new AppError(message, 400);
};
const sendErrorDev = (err: AppError, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack
    });
};
const sendErrorProd = (err: AppError, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        logging.error(err);

        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
        });
    }
};

module.exports = (err: AppError, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
    // } else {
    // let error = { ...err };
    // if (err.name === 'CastError') {
    //     error = handleCastErrorDB(error);
    // }
    // if (err.code === 11000) {
    //     error = handleDuplicateFieldsDB(err);
    // }
    // if (err.name === 'ValidationError') {
    //     error = handleValidationErrorDB(error);
    // }
    // sendErrorProd(error, res);
    //}
};

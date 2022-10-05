import { promisify } from 'util';
import jwt from 'jsonwebtoken';
const UserService = require('../services/userService');
import logging from '../library/logging';
const AppError = require('../middleware/appError');
const catchAsync = require('./../middleware/catchAsync');
const UserServiceInstance = new UserService();

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await UserServiceInstance.createUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    const token = signToken(newUser._id);
    res.status(201).json({
        status: 'success',
        token,
        data: {
            user: newUser
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }
    const user = await UserServiceInstance.getUserAuth({ email });

    if (!user || !(await UserServiceInstance.isCorrectPassword(user, password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);
    res.status(201).json({
        status: 'success',
        token
    });
});

exports.protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new AppError('You are not logged in! Please login to access', 401));
    }
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const loggedUser = await UserServiceInstance.getUserById(decoded.id);
    if (!loggedUser) {
        return next(new AppError('The user belonging to this token does no longer exist. ', 401));
    }
    if (UserServiceInstance.isCorrectPassword(loggedUser, decoded.iat)) {
        return next(new AppError('User recently changed password! Please login again!. ', 401));
    }

    req.user = loggedUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user)) {
            return next(new AppError('You do not have permission!', 403));
        }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await UserServiceInstance.getUser({ email: req.body.email });
    if (!user) {
        return next(new AppError('The user does not exist. ', 404));
    }
});
exports.resetPassword = async (req, res, next) => {};

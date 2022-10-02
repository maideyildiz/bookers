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

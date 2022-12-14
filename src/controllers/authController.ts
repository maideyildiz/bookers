import { promisify } from 'util';
import jwt from 'jsonwebtoken';
const UserService = require('../services/userService');
const sendEmail = require('../services/emailService');
import logging from '../library/logging';
const AppError = require('../middleware/appError');
const catchAsync = require('./../middleware/catchAsync');
const UserServiceInstance = new UserService();
import crypto from 'crypto';

const signToken = (id) => {
    return jwt.sign({ id: id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        //secure: true, //only on production
        httpOnly: true
    };
    //if production cookieOptions.secure=true
    res.cookie('jwt', token, cookieOptions);
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await UserServiceInstance.createUser({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(newUser, 201, res);
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
    createSendToken(user, 200, res);
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
    const resetToken = await UserServiceInstance.saveUserResetPasswordToken({ email: req.body.email });
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to:${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        //kaydedileni geri al
        await UserServiceInstance.saveUserResetPasswordToken({ email: undefined });
        return next(new AppError('Had an error. Try again'), 500);
    }
});
exports.resetPassword = async (req, res, next) => {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await UserServiceInstance.getUser({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) {
        return next(new AppError('Token is invalid or has expired', 400));
    }
    await UserServiceInstance.changePassword(user, req.body.password, req.body.passwordCurrent, true);
    createSendToken(user, 200, res);
};
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await UserServiceInstance.getUserAuthById(req.params.id);

    if (!(await UserServiceInstance.isCorrectPassword(user, req.body.passwordConfirm))) {
        return next(new AppError('Your current password id wrong', 401));
    }
    await UserServiceInstance.changePassword(user, req.body.password, req.body.passwordConfirm, false);

    createSendToken(user, 200, res);
});

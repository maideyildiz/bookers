import { Response, Request, NextFunction } from 'express';
const catchAsync = require('./../middleware/catchAsync');
const UserService = require('../services/userService');
const AppError = require('../middleware/appError');
const UserServiceInstance = new UserService();

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((x) => {
        if (allowedFields.includes(x)) newObj[x] = obj[x];
    });
    return newObj;
};

exports.getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await UserServiceInstance.getUsers(req.body);
    res.set('Content-Type', 'application/json');
    res.status(200).send(users);
});

exports.getUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServiceInstance.getUserById(req.params.id);
    res.status(200).send(user);
});

exports.createUser = catchAsync(async (req: Request, res: Response) => {
    const newUser = await UserServiceInstance.createUser(req.body);
    res.status(200).send(newUser);
});

exports.updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserServiceInstance.updateUser(req.params.id, req.body);
    res.status(200).send(user);
});

exports.deleteUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserServiceInstance.deleteUser(req.params.id);
    res.status(204).send(result);
});

exports.updateAuthUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('This route is not for password updates.Please use /updatePassword', 400));
    }
    const filteredBody = filterObj(req.body, 'username', 'email', 'photo');
    const updatedUser = await UserServiceInstance.updateUser(req.body.id, filteredBody);
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
});

exports.deleteAuthUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    await UserServiceInstance.updateUserWithoutOptions(req.body.id, { isActive: false });
    res.status(204).json({
        status: 'success',
        data: null
    });
});

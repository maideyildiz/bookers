const UserService = require('../services/userService');
const catchAsync = require('./../middleware/catchAsync');
const UserServiceInstance = new UserService();

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = UserServiceInstance.createUser(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser
        }
    });
});

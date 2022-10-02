import { Response, Request } from 'express';
const UserService = require('../services/userService');
const UserServiceInstance = new UserService();

exports.getAllUsers = async (req: Request, res: Response) => {
    const users = await UserServiceInstance.getUsers(req.body);
    res.set('Content-Type', 'application/json');
    res.status(200).send(users);
};

exports.getUser = async (req: Request, res: Response) => {
    const user = await UserServiceInstance.getUserById(req.params.id);
    res.status(200).send(user);
};

exports.createUser = async (req: Request, res: Response) => {
    const newUser = await UserServiceInstance.createUser(req.body);
    res.status(200).send(newUser);
};

exports.updateUser = async (req: Request, res: Response) => {
    const user = await UserServiceInstance.updateUser(req.params.id, req.body);
    res.status(200).send(user);
};

exports.deleteUser = async (req: Request, res: Response) => {
    const result = await UserServiceInstance.deleteUser(req.params.id);
    res.status(204).send(result);
};

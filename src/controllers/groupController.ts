import { Response, Request } from 'express';
const groupService = require('../services/groupService');
const catchAsync = require('./../middleware/catchAsync');
const groupServiceInstance = new groupService();

exports.getAllGroups = catchAsync(async (req: Request, res: Response) => {
    const groups = await groupServiceInstance.getGroups(req.body);
    res.status(200).send(groups);
});

exports.getGroup = catchAsync(async (req: Request, res: Response) => {
    const group = await groupServiceInstance.getGroupById(req.params.id);
    res.status(200).send(group);
});

exports.createGroup = catchAsync(async (req: Request, res: Response) => {
    const newGroup = await groupServiceInstance.createGroup(req.body);
    res.status(200).send(newGroup);
});

exports.updateGroup = catchAsync(async (req: Request, res: Response) => {
    const group = await groupServiceInstance.updateGroup(req.params.id, req.body);
    res.status(200).send(group);
});

exports.deleteGroup = catchAsync(async (req: Request, res: Response) => {
    const result = await groupServiceInstance.deleteGroup(req.params.id);
    res.status(204).send(result);
});

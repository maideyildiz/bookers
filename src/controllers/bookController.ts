import { Response, Request } from 'express';
const bookService = require('../services/bookService');
const catchAsync = require('./../middleware/catchAsync');
const bookServiceInstance = new bookService();

exports.getAllbooks = catchAsync(async (req: Request, res: Response) => {
    const books = await bookServiceInstance.getbooks(req.body);
    res.status(200).send(books);
});

exports.getbook = catchAsync(async (req: Request, res: Response) => {
    const book = await bookServiceInstance.getbookById(req.params.id);
    res.status(200).send(book);
});

exports.createbook = catchAsync(async (req: Request, res: Response) => {
    const newbook = await bookServiceInstance.createbook(req.body);
    res.status(200).send(newbook);
});

exports.updatebook = catchAsync(async (req: Request, res: Response) => {
    const book = await bookServiceInstance.updatebook(req.params.id, req.body);
    res.status(200).send(book);
});

exports.deletebook = catchAsync(async (req: Request, res: Response) => {
    const result = await bookServiceInstance.deletebook(req.params.id);
    res.status(204).send(result);
});

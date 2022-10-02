import { Response, Request } from 'express';
const bookService = require('../services/bookServise');
const bookServiceInstance = new bookService();
exports.getAllbooks = async (req: Request, res: Response) => {
    const books = await bookServiceInstance.getbooks(req.body);
    res.status(200).send(books);
};
exports.getbook = async (req: Request, res: Response) => {
    const book = await bookServiceInstance.getbookById(req.params.id);
    res.status(200).send(book);
};

exports.createbook = async (req: Request, res: Response) => {
    const newbook = await bookServiceInstance.createbook(req.body);
    res.status(200).send(newbook);
};
exports.updatebook = async (req: Request, res: Response) => {
    const book = await bookServiceInstance.updatebook(req.params.id, req.body);
    res.status(200).send(book);
};
exports.deletebook = async (req: Request, res: Response) => {
    const result = await bookServiceInstance.deletebook(req.params.id);
    res.status(204).send(result);
};

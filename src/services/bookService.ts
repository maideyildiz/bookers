const Book = require('../models/bookModel');
import { Request } from 'express';
class bookService {
    async getbooks(query: Request['body']) {
        return await Book.find(query);
    }
    async getbookById(id: Number) {
        return await Book.findById(id);
    }
    async createbook(postToCreate: Request['body']) {
        const newbook = new Book(postToCreate);
        await this.save(newbook);
        return newbook;
    }
    async updatebook(id: Number, body: Request['body']) {
        const book = await Book.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });
        return book;
    }
    async deletebook(id: Number) {
        return await Book.findByIdAndDelete(id);
    }
    async save(book: typeof Book) {
        return await book.save();
    }
}

module.exports = bookService;

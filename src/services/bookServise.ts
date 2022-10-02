const Book = require("../models/bookModel");
import { Request } from "express";
class bookService {
  async getbooks(query: Request["body"]) {
    try {
      // const queryObj = { ...query };
      // const excludedFields = ["page", "sort", "limit", "fields"];
      // excludedFields.forEach((x) => delete queryObj[x]);
      const books = await Book.find();
      return {
        success: true,
        books,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async getbookById(id: Number) {
    try {
      const book = await Book.findById(id);
      return {
        success: true,
        book,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async createbook(postToCreate: Request["body"]) {
    const newbook = new Book(postToCreate);
    try {
      const result = await this.save(newbook);
      return {
        success: true,
        body: result,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async updatebook(id: Number, body: Request["body"]) {
    try {
      const book = await Book.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      return {
        success: true,
        book,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async deletebook(id: Number) {
    try {
      const result = await Book.findByIdAndDelete(id);
      return {
        success: true,
        result,
      };
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
  async save(book: typeof Book) {
    try {
      await book.save();
    } catch (err) {
      return {
        success: false,
        error: err,
      };
    }
  }
}

module.exports = bookService;
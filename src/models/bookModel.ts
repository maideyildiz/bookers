import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
      bookname: {
        type: String,
        required: [true, "Must have a book name"],
        unique: true,
      },
      writer: {
        type: String,
        required: [true, "Must have a writer name"],
      },
      language: {
        type: String,
        required: [true, "Must have a language"],
      },
      numberOfPages: {
        type: Number,
        required: [true, "Must have number of pages"],
      },
      // group: [
      //   {
      //     type: Schema.Types.ObjectId,
      //     ref: "Group",
      //   },
      // ],
    },
    {
      autoCreate: true, // auto create collection
      autoIndex: true, // auto create indexes
    }
  );
  const Book = mongoose.model("Books", bookSchema);
  module.exports = Book;
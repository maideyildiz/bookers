import express from 'express';
//const morgan = require("morgan");
const bookRouter = require('./routes/bookRoutes');
//const groupRouter = require("./routes/groupRoutes");

const app = express();

app.use(express.json());

app.use('/api/v1/books', bookRouter);
//app.use("/api/v1/group", groupRouter);

module.exports = app;

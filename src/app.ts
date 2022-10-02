import express from 'express';
const bookRouter = require('./routes/bookRoutes');
//const userRouter = require("./routes/userRoutes");
//const groupRouter = require("./routes/groupRoutes");

const app = express();

app.use(express.json());

app.use('/api/v1/books', bookRouter);
//app.use('/api/v1/users', userRouter);
//app.use("/api/v1/group", groupRouter);

module.exports = app;

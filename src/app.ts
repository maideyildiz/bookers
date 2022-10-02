import express from 'express';
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./middleware/appError');
const globalErrorHandler = require('./controllers/errorController');
//const groupRouter = require("./routes/groupRoutes");

const app = express();

app.use(express.json());

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
//app.use("/api/v1/group", groupRouter);
app.all('*', (req, res, next) => {
    next(new AppError(`Cant find ${req.url} on this server!`, 400));
});

app.use(globalErrorHandler);

module.exports = app;

import express from 'express';
import rateLimit from 'express-rate-limit';
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
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many request from this IP, please try again in an hour!'
});
app.use('/api', limiter);
app.use(globalErrorHandler);

module.exports = app;

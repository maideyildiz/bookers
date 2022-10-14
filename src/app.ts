import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSantize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
const bookRouter = require('./routes/bookRoutes');
const userRouter = require('./routes/userRoutes');
const groupRouter = require('./routes/groupRoutes');
const AppError = require('./middleware/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(helmet());
app.use(express.json({ limit: '10kb' }));

//Data sanitization agains NoSql query injection
app.use(mongoSantize());
//Data sanitization XSS
app.use(xss());
//Prevent parameter polition (on url)
//Can add some strings to allow dublicate with whitelist param
app.use(hpp());

app.use('/api/v1/books', bookRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/group', groupRouter);
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

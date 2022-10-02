const mongoose = require('mongoose');
import { config } from './config/config';
const api = require('./app');
import logging from './library/logging';
//const book = require("./models/bookModel");

mongoose.set('debug', true);
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        logging.info('Successful Connection');
    })
    .catch((error) => {
        logging.error(error);
    });

const server = api.listen(config.server.port, () => {
    logging.info(`App running on port ${config.server.port}...`);
});

process.on('unhandledRejection', (err: Error) => {
    logging.error(err.message);
    logging.error("Unhandled Rejection' 💥💥💥Shutting down...");
    server.close(() => {
        process.exit(1);
    });
});

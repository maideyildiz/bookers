const mongoose = require('mongoose');
import { config } from './config/config';
const api = require('./app');
//const book = require("./models/bookModel");

mongoose.set('debug', true);
mongoose
    .connect(config.mongo.url, {
        retryWrites: true,
        w: 'majority'
    })
    .then(() => {
        console.log('Successful Connection');
    })
    .catch((error) => {
        console.log(error);
    });

api.listen(config.server.port, () => {
    console.log(`App running on port ${config.server.port}...`);
});

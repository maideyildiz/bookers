import dotenv from 'dotenv';
import logging from '../library/logging';

process.on('uncaughtException', (err) => {
    logging.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    logging.error(err.message);
    process.exit(1);
});

dotenv.config();
const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';

const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@booker.iyj9lqs.mongodb.net/`;
const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8090;

export const config = {
    mongo: {
        url: MONGO_URL
    },
    server: {
        port: SERVER_PORT
    }
};

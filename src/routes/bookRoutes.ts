import express from 'express';
const router = express.Router();
const bookController = require('../controllers/bookController');

router.route('/').get(bookController.getAllbooks).post(bookController.createbook); //admin users only

router.route('/:id').get(bookController.getbook).patch(bookController.updatebook).delete(bookController.deletebook);

module.exports = router;

import express from 'express';
const router = express.Router();
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

router.route('/').get(authController.protect, bookController.getAllbooks).post(bookController.createbook); //admin users only

router.route('/:id').get(bookController.getbook).patch(bookController.updatebook).delete(bookController.deletebook);

module.exports = router;

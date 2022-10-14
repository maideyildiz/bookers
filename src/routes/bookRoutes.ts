import express from 'express';
const router = express.Router();
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');

router.route('/').get(authController.protect, bookController.getAllbooks).post(authController.protect, authController.restrictTo('admin'), bookController.createbook); //admin users only

router
    .route('/:id')
    .get(authController.protect, bookController.getbook)
    .patch(authController.protect, authController.restrictTo('admin'), bookController.updatebook)
    .delete(authController.protect, authController.restrictTo('admin'), bookController.deletebook);

module.exports = router;

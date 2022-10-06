import express from 'express';
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch('/updatePassword', authController.protect, authController.updatePassword);
router.patch('/updateData', authController.protect, userController.updateAuthUser);
router.delete('/deleteAccount', authController.protect, userController.deleteAuthUser);

router
    .route('/')
    .get(authController.protect, authController.restrictTo('admin'), userController.getAllUsers)
    .post(authController.protect, authController.restrictTo('admin'), userController.createUser); //only for admin users

router
    .route('/:id')
    .get(authController.protect, authController.restrictTo('admin'), userController.getUser)
    .patch(authController.protect, authController.restrictTo('admin'), userController.updateUser)
    .delete(authController.protect, authController.restrictTo('admin'), userController.deleteUser); //only for admin users

module.exports = router;

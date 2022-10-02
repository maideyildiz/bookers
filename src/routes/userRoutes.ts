import express from 'express';
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/edit', userController.updateUser);
router.delete('/edit', userController.deleteUser);

//router.route('/').get(userController.getAllUsers).post(userController.createUser); //only for admin users

//router.route('/:id').get(userController.getUser).patch(userController.updateUser).delete(userController.deleteUser); //only for admin users

module.exports = router;

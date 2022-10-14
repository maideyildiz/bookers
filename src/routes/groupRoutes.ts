import express from 'express';
const router = express.Router();
const groupController = require('../controllers/groupController');
const authController = require('../controllers/authController');

router.route('/').get(authController.protect, groupController.getAllGroups).post(authController.protect, groupController.createGroup);

router
    .route('/:id')
    .get(authController.protect, groupController.getGroup)
    .patch(authController.protect, authController.restrictTo('group-admin'), groupController.updateGroup)
    .delete(authController.protect, authController.restrictTo('group-admin'), groupController.deleteGroup);

module.exports = router;

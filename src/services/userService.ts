const User = require('../models/userModel');
import logging from '../library/logging';
import { Request } from 'express';
class UserService {
    async getUsers(query: Request['body']) {
        return await User.find(query);
    }
    async getUserById(id: Number) {
        return await User.findById(id);
    }
    async getUser(query: Request['body']) {
        const user = await User.findOne(query);
        return user;
    }
    async getUserResetPasswordToken(query: Request['body']) {
        const user = await this.getUser(query);
        const resetToken = user.createPasswordResetToken();
        await this.saveBeforeSave(user);
        return resetToken;
    }
    async getUserAuth(query: Request['body']) {
        const user = await this.getUser(query);
        return user.select('+password');
    }
    isCorrectPassword(user: typeof User, timestamp) {
        const ifCorrect = user.changedPasswordAfter(timestamp);
        return ifCorrect;
    }
    async didUserChangedPassword(user: typeof User, password_two: String) {
        const ifCorrect = await user.correctPassword(password_two, user.password);
        return ifCorrect;
    }
    async createUser(user: Request['body']) {
        const newUser = new User(user);
        await this.save(newUser);
        return newUser;
    }
    async updateUser(id: Number, body: Request['body']) {
        const user = await User.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });
        return user;
    }
    async deleteUser(id: Number) {
        return await User.findByIdAndDelete(id);
    }
    async save(user: typeof User) {
        return user.save();
    }
    async saveBeforeSave(user: typeof User) {
        return user.save({ validateBeforeSave: false });
    }
}

module.exports = UserService;

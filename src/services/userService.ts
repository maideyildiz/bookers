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
    async getUserAuth(query: Request['body']) {
        const user = await User.findOne(query).select('+password');
        return user;
    }
    async isCorrectPassword(user: typeof User, password_two: String) {
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
}

module.exports = UserService;

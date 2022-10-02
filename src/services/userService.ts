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
    async createUser(user: Request['body']) {
        const newUser = new User(user);
        const result = await this.save(newUser);
        return result;
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

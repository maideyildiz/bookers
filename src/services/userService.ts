const User = require('../models/userModel');
import { Request } from 'express';
class UserService {
    async getUsers(query: Request['body']) {
        try {
            const Users = await User.find(query);
            return {
                success: true,
                data: Users
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
    async getUserById(id: Number) {
        try {
            const user = await User.findById(id);
            return {
                success: true,
                user
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
    async createUser(user: Request['body']) {
        const newUser = new User(user);
        try {
            const result = await this.save(newUser);
            return {
                success: true,
                body: result
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
    async updateUser(id: Number, body: Request['body']) {
        try {
            const user = await User.findByIdAndUpdate(id, body, {
                new: true,
                runValidators: true
            });
            return {
                success: true,
                user
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
    async deleteUser(id: Number) {
        try {
            const result = await User.findByIdAndDelete(id);
            return {
                success: true,
                result
            };
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
    async save(user: typeof User) {
        try {
            await User.save();
        } catch (err) {
            return {
                success: false,
                error: err
            };
        }
    }
}

module.exports = UserService;

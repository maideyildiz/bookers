const Group = require('../models/groupModel');
import { Request } from 'express';
class groupService {
    async getGroup(query: Request['body']) {
        return await Group.find(query);
    }
    async getGroupById(id: Number) {
        return await Group.findById(id);
    }
    async createGroup(groupToCreate: Request['body']) {
        const newgroup = new Group(groupToCreate);
        await this.save(newgroup);
        return newgroup;
    }
    async updateGroup(id: Number, body: Request['body']) {
        const group = await Group.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true
        });
        return group;
    }
    async deleteGroup(id: Number) {
        return await Group.findByIdAndDelete(id);
    }
    async save(group: typeof Group) {
        return await group.save();
    }
}

module.exports = groupService;

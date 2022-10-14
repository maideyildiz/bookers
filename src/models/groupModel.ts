import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const groupSchema = new mongoose.Schema(
    {
        groupname: {
            type: String,
            required: [true, 'Must have a group name'],
            unique: true
        },
        is_active: {
            type: Boolean,
            default: true
        },
        created_ad: {
            type: Date,
            default: Date.now()
        },
        lastDayOfUsage: {
            type: Date,
            default: Date.now() + 10
        },
        book: {
            type: Schema.Types.ObjectId,
            required: [true, 'Must have a book for the group'],
            ref: 'Book'
        },
        users: [
            //array of users
            {
                type: Schema.Types.ObjectId,
                required: [true, 'Must have a users for the group'],
                ref: 'User'
            }
        ]
    },
    {
        autoCreate: true, // auto create collection
        autoIndex: true // auto create indexes
    }
);
const Group = mongoose.model('groups', groupSchema);
module.exports = Group;

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: [true, 'Must have a user name'],
            unique: true
        },
        email: {
            type: String,
            unique: true,
            required: [true, 'Must have a email']
        },
        password: String,
        is_active: {
            type: Boolean,
            default: true
        },
        created_ad: {
            type: Date,
            default: Date.now()
        },
        last_login_date: {
            type: Date,
            default: Date.now()
        }
        // group: [
        //   {
        //     type: Schema.Types.ObjectId,
        //     ref: "Group",
        //   },
        // ],
    },
    {
        autoCreate: true, // auto create collection
        autoIndex: true // auto create indexes
    }
);
const User = mongoose.model('Users', userSchema);
module.exports = User;

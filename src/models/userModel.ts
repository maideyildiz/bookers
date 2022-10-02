import mongoose from 'mongoose';
import validator from 'validator';
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
            required: [true, 'Must have a email'],
            lowercase: true,
            validate: [validator.isEmail, 'Please provide a valid email']
        },
        photo: String,
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: 8
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                //only works on save or create
                validator: function (el: String) {
                    return el === (this as any).password;
                }
            }
        },
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

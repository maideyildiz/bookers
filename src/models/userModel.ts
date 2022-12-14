import crypto from 'crypto';
const mongoose = require('mongoose');
const validator = require('validator');
import bcrypt from 'bcryptjs';
const Schema = mongoose.Schema;

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
            minlength: 8,
            select: false
        },
        passwordConfirm: {
            type: String,
            required: [true, 'Please confirm your password'],
            validate: {
                //only works on save or create
                validator: function (el: String) {
                    return el === this.password;
                },
                message: 'Passwords are not the same!!!'
            }
        },
        is_active: {
            type: Boolean,
            default: true,
            select: false
        },
        created_ad: {
            type: Date,
            default: Date.now()
        },
        last_login_date: {
            type: Date,
            default: Date.now()
        },
        role: {
            type: String,
            enum: ['user', 'group-admin', 'admin'],
            default: 'user'
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        group: {
            type: Schema.Types.ObjectId,
            ref: 'Group'
        }
    },
    {
        autoCreate: true, // auto create collection
        autoIndex: true // auto create indexes
    }
);

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre(/^find/, function (next) {
    this.field({ isActive: { $ne: false } });
    next();
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: Number) {
    if (this.passwordChangedAt) {
        const changedTimestamps = parseInt(this.passwordChangedAt.getTime(), 10) / 100;
        return JWTTimestamp < changedTimestamps;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('Users', userSchema);
module.exports = User;

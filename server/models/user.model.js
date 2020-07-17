const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var userSchema = new mongoose.Schema({
    fullName: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
});

// Custom validation for email

// Events
userSchema.pre('save', function (next) {
            next();
});


// Methods
userSchema.methods.verifyPassword = function (password) {
    return password=== this.password;
};

userSchema.methods.generateJwt = function () {
    return jwt.sign({ _id: this._id},
        process.env.JWT_SECRET,
    {
        expiresIn: process.env.JWT_EXP
    });
}



mongoose.model('User', userSchema);
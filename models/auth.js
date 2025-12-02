const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const authSchema = mongoose.Schema ({
    name: {
        type: String,
        required:[true, 'Name is required'],
        minlength: 3
    },
    email:{
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
    },
    password:{
        type: String,
        required: [true, 'Password is required'],
        minlength: 6
    }
});

// Hash password before saving
authSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

// Compare password
authSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', authSchema);

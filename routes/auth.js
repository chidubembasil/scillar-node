const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/auth');

// AUTH ROUTE (Login + Register in one endpoint)
router.post('/', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // FIND USER
        let user = await User.findOne({ email });

        // REGISTER (IF USER DOESN’T EXIST)
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await User.create({
                name,
                email,
                password: hashedPassword
            });

            return res.status(201).json({
                success: true,
                isNewUser: true,
                message: "User created",
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email
                }
            });
        }

        // LOGIN (IF USER EXISTS)
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        return res.json({
            success: true,
            isNewUser: false,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

module.exports = router;

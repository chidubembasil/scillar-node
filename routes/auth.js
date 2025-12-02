const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/auth');

router.post('/', (req, res) => {
    const { email, password, name } = req.body;


    User.findOne({ email })
        .then(user => {
            if (!user) {

                User.create({ name, email, password })
                    .then(newUser => res.status(201).json({
                        success: true,
                        message: 'User created',
                        user: { name: newUser.name, email: newUser.email }
                    }))
                    .catch(err => res.status(400).json({ success: false, message: err.message }));
            } else {

                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) return res.status(500).json({ success: false, message: err.message });

                    if (isMatch) {
                        res.json({ success: true, message: 'Login successful', user: { name: user.name, email: user.email } });
                    } else {
                        res.status(400).json({ success: false, message: 'Incorrect password' });
                    }
                });
            }
        })
        .catch(err => res.status(500).json({ success: false, message: err.message }));
});


router.put('/update', (req, res) => {
    /*  .then(user)=>{
 
     } */
})


module.exports = router;


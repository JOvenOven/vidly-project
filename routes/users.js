const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async (req, res) => {
    // Validate user
    const { error } = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Validate the user is not already registered
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered.');
    
    // Create user object
    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    
    // Hash password with salt and bcrypt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save user on database
    await user.save();

    const token = user.generateAuthToken();
    // Send the result
    res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
});

module.exports = router;
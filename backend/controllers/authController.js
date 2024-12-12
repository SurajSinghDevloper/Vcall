const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'VCALL', { expiresIn: '1h' });
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }

};

exports.signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before saving it to the database;

        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
        });

        // Save the user to the database
        await newUser.save();



        res.status(201).json({ message: "USER CREATED SUCESSFULLY" });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}
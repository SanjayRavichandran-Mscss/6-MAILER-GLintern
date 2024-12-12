const bcrypt = require('bcrypt');
const db = require('../config/db');
const sendEmail = require('../utils/sendEmail');

// Register User
exports.register = async (req, res) => {
    const { username, email, password, course, college, city, state, country } = req.body;

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const [result] = await db.execute(
            "INSERT INTO users (username, email, password, course, college, city, state, country) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [username, email, hashedPassword, course, college, city, state, country]
        );

        // Send confirmation email
        await sendEmail(
            email,
            "Welcome to Our Platform!",
            `Hi ${username},\n\nThank you for registering with our platform. We're excited to have you onboard!\n\nBest regards,\nThe Team KG Genius Lab`
        );

        res.status(201).json({ message: "User registered successfully!", userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Fetch user by email
        const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);

        if (rows.length === 0) return res.status(404).json({ message: "User not found" });

        const user = rows[0];

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        res.status(200).json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

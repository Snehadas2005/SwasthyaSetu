const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection = require("./mongodb");
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const validator = require('validator');
require('dotenv').config();

const templatePath = path.join(__dirname, "../templates");

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Login rate limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts, please try again later.'
});

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", templatePath);
app.use(express.urlencoded({ extended: false }));

// JWT middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Routes
app.get("/", (req, res) => {
    res.render("login");
});

app.get("/signup", (req, res) => {
    res.render("signup");
});

app.post("/signup", async (req, res) => {
    try {
        const { name, email, password, 'confirm-password': confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.render("signup", {
                error: "All fields are required."
            });
        }

        if (!validator.isEmail(email)) {
            return res.render("signup", {
                error: "Please enter a valid email address."
            });
        }

        if (password.length < 7) {
            return res.render("signup", {
                error: "Password must be at least 7 characters long."
            });
        }

        if (password !== confirmPassword) {
            return res.render("signup", {
                error: "Passwords do not match."
            });
        }

        // Check if user already exists
        const existingUser = await collection.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.render("signup", {
                error: "User with this email already exists."
            });
        }

        const userData = {
            name: validator.escape(name.trim()),
            email: email.toLowerCase().trim(),
            password,
        };

        await collection.create(userData);
        res.render("login", { 
            success: "Account created successfully! Please login." 
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.render("signup", {
            error: "An error occurred during registration. Please try again."
        });
    }
});

app.post("/login", loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.render("login", {
                error: "Username/Email and password are required."
            });
        }

        // Find user by username or email
        const user = await collection.findOne({
            $or: [
                { name: username },
                { email: username.toLowerCase() }
            ]
        });

        if (!user) {
            return res.render("login", {
                error: "Invalid credentials."
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.render("login", {
                error: "Account is deactivated. Please contact support."
            });
        }

        // Compare password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.render("login", {
                error: "Invalid credentials."
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        // For web interface, render home page
        res.render("home", {
            user: {
                name: user.name,
                email: user.email,
                role: user.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.render("login", {
            error: "An error occurred during login. Please try again."
        });
    }
});

// API endpoint for frontend integration
app.post("/api/login", loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: "Username/Email and password are required." });
        }

        const user = await collection.findOne({
            $or: [
                { name: username },
                { email: username.toLowerCase() }
            ]
        });

        if (!user || !user.isActive) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials." });
        }

        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { 
                userId: user._id, 
                email: user.email, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('API Login error:', error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Protected route example
app.get("/api/profile", authenticateToken, async (req, res) => {
    try {
        const user = await collection.findById(req.user.userId).select('-password');
        res.json({ user });
    } catch (error) {
        res.status(500).json({ error: "Internal server error." });
    }
});

app.get("/logout", (req, res) => {
    res.redirect("/");
});

// Health check endpoint
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`SwasthyaSetu Auth Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

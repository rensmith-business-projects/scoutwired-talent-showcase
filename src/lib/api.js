// Import required modules
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize Express app
const app = express();
app.use(express.json());

// Initialize Sequelize
const sequelize = new Sequelize('scout_showcase', 'scout_user', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

// Define models
const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'scout' },
});

const Showcase = sequelize.define('Showcase', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});

const Comment = sequelize.define('Comment', {
    content: { type: DataTypes.TEXT, allowNull: false },
    showcaseId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
});

// Define relationships
User.hasMany(Showcase, { foreignKey: 'userId' });
Showcase.belongsTo(User, { foreignKey: 'userId' });

Showcase.hasMany(Comment, { foreignKey: 'showcaseId' });
Comment.belongsTo(Showcase, { foreignKey: 'showcaseId' });

Comment.belongsTo(User, { foreignKey: 'userId' });

// Sync the models with the database
sequelize.sync();

// Middleware to authenticate users
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes

// Register a new user
app.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ username, email, password: hashedPassword, role });
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login route to authenticate users
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });
    if (user == null) return res.status(400).send('Cannot find user');

    try {
        if (await bcrypt.compare(password, user.password)) {
            const accessToken = jwt.sign({ username: user.username, role: user.role }, 'your_jwt_secret');
            res.json({ accessToken });
        } else {
            res.send('Not Allowed');
        }
    } catch {
        res.status(500).send();
    }
});

// Create a new showcase
app.post('/showcases', authenticateToken, async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    try {
        const showcase = await Showcase.create({ title, description, userId });
        res.status(201).json(showcase);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all showcases
app.get('/showcases', async (req, res) => {
    try {
        const showcases = await Showcase.findAll({ include: [User] });
        res.json(showcases);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add a comment to a showcase
app.post('/showcases/:id/comments', authenticateToken, async (req, res) => {
    const { content } = req.body;
    const userId = req.user.id;
    const showcaseId = req.params.id;

    try {
        const comment = await Comment.create({ content, showcaseId, userId });
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

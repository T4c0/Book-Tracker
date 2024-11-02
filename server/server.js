const express = require("express");
const cors = require("cors");
const app = express();
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const PORT = 4004;
const books = require('./db.json');
const BASE_URL = "/api/books";
const users = [];
let ID = 11;

// Define your secret key for JWT
const SECRET_KEY = 'your_secret_key'; // Change this to a more secure value in production

app.use(express.json());
app.use(cors());
const corsOptions = {
    origin: 'http://127.0.0.1:5500', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow cookies and authentication headers
};

app.use(cors(corsOptions));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Authentication Routes
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const userExists = users.some(user => user.username === username);
    if (userExists) return res.status(409).send('Username already taken');

    const passwordHash = await bcrypt.hash(password, 10);
    users.push({ username, passwordHash });
    res.status(201).send('User registered');
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = users.find(u => u.username === username);

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token });
        } else {
            res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error("Login error:", error); // Log the error for debugging
        res.status(500).send('Internal Server Error'); // Handle server errors
    }
});

// Protected route example
app.get('/api/protected', (req, res) => {
    if (req.isAuthenticated()) {
        res.send('This is a protected route.');
    } else {
        res.status(401).send('Please log in to access this route.');
    }
});

// Configure Passport
passport.use(new LocalStrategy((username, password, done) => {
    const user = users.find(user => user.username === username);
    if (!user) return done(null, false, { message: 'Incorrect username.' });
    if (!bcrypt.compareSync(password, user.passwordHash)) return done(null, false, { message: 'Incorrect password.' });
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser((username, done) => {
    const user = users.find(user => user.username === username);
    done(null, user);
});

// Book API routes
app.get(BASE_URL, (req, res) => {
    res.status(200).send(books);
});
app.post(BASE_URL, (req, res) => {
    const newBook = req.body;
    newBook.id = ID;
    ID++;
    books.push(newBook);
    res.status(200).send(books);
});
app.delete(`${BASE_URL}/:id`, (req, res) => {
    let index = books.findIndex(elem => elem.id === +req.params.id);
    books.splice(index, 1);
    res.status(200).send(books);
});

app.put(`${BASE_URL}/:id`, (req, res) => {
    let { id } = req.params;
    let { type } = req.body;
    let index = books.findIndex(elem => +elem.id === +id);

    if (books[index].finished === 5 && type === 'plus') {
        res.status(400).send('cannot go above 5');
    } else if (books[index].finished === 0 && type === 'minus') {
        res.status(400).send('cannot go below 0');
    } else if (type === 'plus') {
        books[index].finished++;
        res.status(200).send(books);
    } else if (type === 'minus') {
        books[index].finished--;
        res.status(200).send(books);
    } else {
        res.sendStatus(400);
    }
});

app.listen(PORT, () => console.log(`server listening on port ${PORT}`));

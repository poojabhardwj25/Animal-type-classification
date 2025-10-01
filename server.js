// server.js
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const Buffalo = require('./models/buffalo');
const User = require('./models/user');

const app = express();
const PORT = 3000;

// ------------------ Connect to MongoDB ------------------
mongoose.connect('mongodb://127.0.0.1:27017/buffaloDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

// ------------------ Middleware ------------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ------------------ Routes ------------------

// Home page
app.get('/', (req, res) => {
    res.render('index'); // index.ejs
});

// Dashboard
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

// Breed database page
app.get('/breed-database', async (req, res) => {
    const breeds = await Buffalo.find({});
    res.render('breed-database', { breeds });
});

// Single breed page
app.get('/breed/:id', async (req, res) => {
    const breed = await Buffalo.findById(req.params.id);
    res.render('breed', { breed });
});

// Records page
app.get('/records', (req, res) => {
    res.render('records');
});

// Registration page
app.get('/registration', (req, res) => {
    res.render('registration');
});

// Login page
app.get('/login', (req, res) => {
    res.render('login');
});

// ------------------ API Routes ------------------

// Add new buffalo breed
app.post('/api/breeds', async (req, res) => {
    const newBreed = new Buffalo(req.body);
    await newBreed.save();
    res.redirect('/breed-database');
});

// Update existing buffalo breed
app.put('/api/breeds/:id', async (req, res) => {
    const updatedBreed = await Buffalo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect('/breed-database');
});

// Delete buffalo breed
app.delete('/api/breeds/:id', async (req, res) => {
    await Buffalo.findByIdAndDelete(req.params.id);
    res.redirect('/breed-database');
});

// User registration
app.post('/api/register', async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.redirect('/login');
});

// User login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username, password });
    if(user) {
        res.redirect('/dashboard');
    } else {
        res.send('Invalid credentials');
    }
});

// ------------------ Start Server ------------------
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
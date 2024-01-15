require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const { Pool } = require('pg');

// Controllers
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const image = require('./controllers/image');
// Add any other controllers you might have
const ssl = process.env.ENV === "prod" ? { rejectUnauthorized: false } : false;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ssl
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.options("/image");

app.get('/about', (req, res) => {
  res.send("success");
});

// Update the route handlers to pass the 'pool' instead of 'db'
app
.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, pool));

app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, pool));

app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, pool));

app.put('/image', (req, res) => image.handleImage(req, res, pool));

app.options('/imageurl'); // Enable CORS pre-flight for this route
app.post('/imageurl', (req, res) => image.handleApiCall(req, res));

app.listen(process.env.PORT || 10000, () => {
console.log(`App is running on port ${process.env.PORT || 10000}`);
});

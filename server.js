const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
// then in your app
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')
const cors = require('cors')

const register = require('./controllers/register')
const signin = require('./controllers/signin.js');
const image = require('./controllers/image');



const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});




const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200
};

const app = express();

app.use(bodyParser.json());
app.use(cors(corsOptions));


app.get('/about', (req, res) => {
  res.send("success");
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, db))

app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db))
// app.get('/register', (req, res) => {
//   // Your logic here, for example:
//   res.send('This is the register page');
// });
app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, bcrypt, db))

app.put('/image', (req, res) => image.handleImage(req, res, db))

app.post('/imageurl', (req, res) => image.handleApiCall(req, res))



app.listen(process.env.PORT || 3000, () => {
  console.log(`App is running on port ${process.env.PORT || 3000}`);
});

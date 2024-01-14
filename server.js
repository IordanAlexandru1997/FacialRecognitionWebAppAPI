require('dotenv').config();


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
  connection: process.env.DATABASE_URL + (process.env.ENV === "dev" ? "" : "?ssl=true"),
  pool: {
    min: 0,
    max: 10,
    acquireTimeoutMillis: 60000, // e.g., 60 seconds
  },
  debug: true
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.options("/image");

app.get('/about', (req, res) => {
  res.send("success");
})

app.post('/signin', (req, res) => signin.handleSignin(req, res, bcrypt, db))

app.post('/register', (req, res) => register.handleRegister(req, res, bcrypt, db))
// app.get('/register', async(req, res) => {
//   // Your logic here, for example:
//   try{
//     const data = await db('login').select('*')
 
//     console.log(data)
     
//     res.status(200).json({data})
//   } catch(error){

//     console.log(error);
//     res.status(400).json({error});
//   }
// });

app.get('/profile/:id', (req, res) => profile.handleProfile(req, res, bcrypt, db))

app.put('/image', (req, res) => image.handleImage(req, res, db))


app.options('/imageurl'); // Enable CORS pre-flight for this route
app.post('/imageurl', (req, res) => image.handleApiCall(req, res))



app.listen(process.env.PORT || 10000, () => {
  console.log(`App is running on port ${process.env.PORT || 10000}`);
});

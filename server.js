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
      host : process.env.DATABASE_URL,
      ss:true,
    }
  });

// db.select('*')
//   .from('users').then(data=>{console.log(data)})


const app = express();

app.use(bodyParser.json());
app.use(cors())



app.get('/', (req,res)=>{
    res.send("success");
})

app.post('/signin',(req,res)=> signin.handleSignin(req,res,bcrypt,db))

app.post('/register',(req,res) => register.handleRegister(req,res,bcrypt,db))

app.get('/profile/:id', (req,res)=>profile.handleProfile(req,res,bcrypt,db))

app.put('/image', (req,res)=>image.handleImage(req,res,db))

app.post('/imageurl', (req,res)=>image.handleApiCall(req,res))



app.listen(process.env.PORT || 3000,()=>{
    console.log(`App is running on port ${process.env.PORT}`)
})


/*
    -> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user 
    /profile/:userID --> GET = user
    /image --> PUT  --> user

*/
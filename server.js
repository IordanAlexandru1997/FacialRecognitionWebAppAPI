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
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'test',
      database : 'smart-brain'
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



app.listen(3000,()=>{
    console.log('App is running on port 3000')
})


/*
    -> res = this is working
    /signin --> POST = success/fail
    /register --> POST = user 
    /profile/:userID --> GET = user
    /image --> PUT  --> user

*/
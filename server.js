const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const auth = require('./controllers/auth');




const db = require('knex' )({
  client: 'pg',
  connection: {
    host : process.env.DB_HOST,
    port : process.env.DB_PORT,
    user : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    searchPath: ['knex', 'public'],
  }
});


const app = express();

app.use(cors())
app.use(express.json())


app.post('/signin', signin.signinAuthentication(db, bcrypt));

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) });

app.get('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileGet(req, res, db) });

app.post('/profile/:id', auth.requireAuth, (req, res) => { profile.handleProfileUpdate(req, res, db) });

app.put('/image', auth.requireAuth, (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', auth.requireAuth, (req, res) => { image.handleApiCall(req, res) });


app.listen(3000, ()=> {
  console.log('app is running on port 3000');
})

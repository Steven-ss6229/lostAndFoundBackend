const mongoose = require('mongoose');
const express = require('express');
const dotenv = require("dotenv");
dotenv.config({path: './config.env'});
const app = express();
const PORT = process.env.PORT
require ("./db/conn")
app.use(express.json())

app.use((require('./router/auth')))
const User = require("./schema/users")
app.get('/', (req, res) => {
    res.send('hello guys i am from server ')
})
app.get('/login', (req, res) => {
    res.send('this is from login page ')
})

app.listen(PORT, () => {
console.log("server code is running")
})

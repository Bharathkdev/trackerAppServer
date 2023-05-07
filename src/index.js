require('./models/User');               //no need to assign it to a variable or "User" gets exported from the User.js file because mongoose will 
require('./models/Track');              //expect this line to appear only once where its required and it cannot be imported in multiple files 
                                        //which leads to error saying "User" has been already defined
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');

const app = express();

app.use(bodyParser.json());  // Parse the JSON body available in the request body before associating the request handlers with the express application

app.use(authRoutes);   //associates all the request handlers we added to the router regarding authorization with the express app
app.use(trackRoutes);  //associates all the request handlers we added to the router regarding tracks with the express app

const mongoURI = 'mongodb+srv://Bharath:bharath@cluster0.0anh5ps.mongodb.net/?retryWrites=true&w=majority';     //URI got from MongoDB server

mongoose.connect(mongoURI);         //connect to MongoDB server with the help of Mongoose via the mongoURI 

mongoose.connection.on('connected', () => {
    console.log('Connected to Mongo Instance');    //check whether we are connected to Mongo Instance
});

mongoose.connection.on('error', (err) => {
    console.error('Error connecting to Mongo Instance', err);   //check whether any error connecting to Mongo Instance
})

app.get('/', requireAuth, (req, res) => {          // executes the requireAuth middleware and only if it reaches the next() and not any error before that, the user will see some response with the help of the third argument which is the request handler
    res.send(`Your email ID is ${req.user.email}`);
}) 

app.listen(3000, () => {
    console.log("Listening on port 3000...");
});
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User'); //We can access the user model which has the underlying user data in the MongoDB like this

const router = express.Router();

router.post('/signup', async(req, res) => {     //route handler for signup
    const {email, password} = req.body;

    try {
        const user = new User({email, password}); // creates a new user with the email and password from the request
        await user.save();  //saves the user data in the MongoDB(async process)
        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');   // creates a new JWT token which contains the userID and the secret key to access/modify the JWT token
        res.send({token}); // sends the token as the response which user can use for the future requests
    } catch (err) {
        return res.status(422).send(err.message);
    }
});

router.post('/signin', async (req, res) => {     //route handler for signin
    const {email, password} = req.body;

    if(!email || !password) {                   //if no email ID or password found return error
        return res.status(422).send({error: "Must provide email ID and password"});
    }

    const user = await User.findOne({email});   //find user with the given mail ID in the MongoDB    

    if(!user) {                                 //if no user found return error
        return res.status(422).send({error: "Invalid email ID or password"});
    }

    try {
        const validUser = await user.comparePassword(password);     //call the comparePassword method we defined in UserSchema which will return true, false or error

        console.log("Valid user: ", validUser);

        if(!validUser) {                       //if provided password is incorrect return error
            return res.status(422).send({error: "Invalid email ID or password"});
        }

        const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY');
        res.send({token});
    } catch (err) {
        console.log("Valid user: ", err);

        return res.status(422).send({error: "Invalid email ID or password"});
    }
});

module.exports = router;
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next) => {
 
    const { authorization } = req.headers;             // Get the authorization header

    if(!authorization) {
        return res.status(401).send({error: 'User must be logged in...'});    // if no authorization token is provided send a error response
    }

    const token = authorization.replace('Bearer ', '');   // extract the token alone from the authorization header

    jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {   //verify the token is valid along with the secret key provided in the User collection
        if(err) {                                                  //it gives an error message if anythinhg goes wrong and also a payload if the token is valid
            return res.status(401).send({error: 'User must be logged in...'});
        }

        const { userId } = payload;

        const user = await User.findById(userId);                   // Get the user data from the User collection
        req.user = user;                                            // Add the user data to the request and forward it to other request handlers if needed
        next();
    });
};
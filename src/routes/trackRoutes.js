const express = require('express');
const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');

const Track = mongoose.model('Track');

const router = express.Router();

router.use(requireAuth);        //this will ensure all the request handlers checks whether the user is signed in or not before getting the required data

router.get('/tracks', async (req, res) => {     //route handler for get list of tracks
    const tracks = await Track.find({userId: req.user._id});        //userId will be available in the request body once the requireAuth 
                                                                    //middleware is passed refer requireAuth middleware file

    res.send({tracks});         //send the list of tracks as response
});

router.post('/tracks', async (req, res) => {      //route handler for creating a new track
    const {name, locations} = req.body;     //get the name of the track and locations from the request body

    if(!name || !locations) {               //check whether the name and locations are available in the request body 
                                            //also the datatype and name of the variables will be checked by mongoose internally
                                            //and throws an error if something is wrong
        res.status(422).send({error: 'Must provide a name for the track and locations'});
    }

    try {
        const track = new Track({userId: req.user._id, name, locations});
        await track.save();
        res.send({track});
    } catch(err) {
        res.status(422).send({error: err.message});
    }
});

module.exports = router;
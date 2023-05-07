const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    timestamp: Number,
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
});

const trackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,  //referencing the userId property to be as the ObjectId data type
        ref: 'User'     //ref is specifically used by mongoose and essentially tells that this UserId is pointing to an instance of the user in the User collection
    },
    name:{
        type: String,
        default: ''            //giving a default value of empty strring if no name is provided
    },
    locations: [pointSchema]  //array of point objects which is another Schema
});

mongoose.model('Track', trackSchema);   //we are only loading up the trackSchema into mongoose and MongoDB since all those point objects will be embedded inside of trackSchema
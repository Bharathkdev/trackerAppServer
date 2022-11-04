const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({   //instructs Mongoose library with a schema/structure for the kind of data that every user has in the Mongo DB is going to have
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.pre('save', function(next) {    //used normal function instead of arrow function because the current user will be referenced as 'this' inside the function
    const user = this;                     //current user is 'this'

    if(!user.isModified('password')) {      //if the password is has not been modified return next and do nothing
        return next();
    }

    bcrypt.genSalt(10, (err, salt)  => {    //generate a salt with the complexity of 10 which gives a callback with an errror message or a generated salt string
        if(err) {
            return next(err);
        }

        bcrypt.hash(user.password, salt, (err, hash) => {      //generate a hashed password with the salt and the plain password which gives a callback with an errror message or a generated hashed password 
            if(err) {
                return next(err);
            }

            user.password = hash;       //assign the hashed password to the user password and store it in MongoDB
            next();
        })
    })
});

userSchema.methods.comparePassword = async function(userPassword) {     //used normal function instead of arrow function because the current user will be referenced as 'this' inside the function
    const user = this;          //current user is 'this'
    
    try {
        const isMatch = await bcrypt.compare(userPassword, user.password);      // since it gives a callback I have awaited for the response for the password comparison

        if(!isMatch) {
            return false;               //if no match return false
        }

        return true;                    //if password matches return true
    } catch (err) {
       throw new Error(err);
    }
};

mongoose.model('User', userSchema);  //associates the user model/schema with the mongoose library
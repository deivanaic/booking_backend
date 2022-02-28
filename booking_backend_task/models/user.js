var mongoose = require('mongoose');
var validator = require('validator');
JWT_KEY = 'winteriscomingarsenal123';
const jwt = require('jsonwebtoken');
var mbcrypt = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 100
    },
    active: {
        type: Boolean,
        default: false
    },
    phone: {
        type: Number,
        required: true,
        unique: true, 
        validate:{
            validator: function(value){
                return /^[0-9]{10}$/.test(value);
            },
            message: "Invalid phone number!!"
        },
    },
    type: {
        type: String,
        required: true,
        enum: ['Client', 'Partner']
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
    password: {
        type: String,
        bcrypt: true,
        required: true,
        minLength: 8,
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxLength: 100,
        validate: value => {
            if (!validator.isEmail(value)){
                throw new Error({error: 'Invalid email address'})
            }
        }

    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.methods.generateAuthToken = async function() {
    // Generate an auth token for the user
    const user = this
    const token = jwt.sign({_id: user._id}, JWT_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

UserSchema.static.findByCredentials = async function(email, password){
    const user = await User.findOne({email});
    if (!user){
        throw new Error({error: 'Invalid login credentials, Check mail id'})
    }
    const isPasswordMatch = await mbcrypt.compare(password, user.password)
    if (!isPasswordMatch){
        throw new Error({error: 'Invalid Login credentials, Check password'})
    }
    return user;
}
UserSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', UserSchema);
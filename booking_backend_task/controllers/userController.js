var User = require('../models/user.js');
var bcrypt = require('bcryptjs');

const saltRounds = 10;
findByCredentials = async function(email, password){
    const user = await User.findOne({email});
    
    if (!user){
        throw {error: 'Invalid login credentials, Check mail id'}
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if (!isPasswordMatch){
        throw {error: 'Invalid Login credentials, Check password'}
    }
    return user;
}


exports.user_signup = async function(req, res, next){
    const hash_password = await bcrypt.hash(req.body.password, saltRounds);
    const new_user = new User({
        name: req.body.name,
        active: req.body.active,
        type: req.body.type,
        phone: req.body.phone, 
        password: hash_password,
        email: req.body.email
        
    });

    new_user.save()
    .then(async function(value){
        var resObj = {};
        const token = await value.generateAuthToken();
        resObj.token = token;
        resObj.user = value;
        return res.status(201).json(resObj);
    }).catch(function(e){
        console.log(e)
        var resObj = {}
        resObj.error = e.message;
        return res.status(400).json(resObj);
    });
};



exports.get_all_users = function(req, res){
    console.log("sdfghj")
    User.find().select(
        '-password -_id'
    )
    .exec()
    .then(function(users){
        var resObj = {};
        resObj.data = users;
        return res.status(200).json(resObj);
        
    })
    .catch(function(err){
        console.log(err)
            var errObj = {};
            errObj.message = err.message;
            return res.status(500).json(errObj);
    });

};


exports.user_login = async function(req, res){
    email = req.body.email;
    password = req.body.password;
    try{
        const user = await findByCredentials(email, password)
        console.log("hi", user)
        if (user != null){
            console.log("ji")
            const token = await user.generateAuthToken()
            user.tokens.push(token);
            return res.status(200).json({user: user, token: token})    
        
        }
    }
    catch(e){
        var resobj = {}
        resobj.error = e.message;
        return res.status(404).json(resobj);
    };
};


exports.user_logout = async function(req, res){
    try{
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token
        })
        console.log("Done")
        await req.user.save();
        console.log("OOk")
        return res.status(200).json({message: "Successfully logged out"});

    }catch(error){
        return res.status(500).json({error_message:error});
    }
};


exports.user_detail = function(req, res){
    return res.status(200).json({user: req.user})
};

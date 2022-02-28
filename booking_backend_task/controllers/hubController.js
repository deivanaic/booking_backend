var Hub = require('../models/hub');
var Booking = require('../models/bookingModel');


exports.get_all_hubs = function(req, res){
    Hub.find({})
    .populate('owner', ['name', 'email'])
    .select()
    .exec()
    .then(function(hubs){
        var resObj = {};
        resObj.status = 200;
        resObj.data = hubs;

        if(resObj.data.length != 0){
            return res.status(200).json(resObj);
        }
        else{
            return res.status(404).json({message: "No hubs found!"})
        }
    })
    .catch(function(err){
        console.log(err)
            var errObj = {};
            errObj.status = 500;
            errObj.message = "Internal server error occured. Please try again later";
            return res.status(200).json(errObj);
    });
};

exports.delete_hub = function(req, res){
    res.send("Not implemented");
};

exports.create_hub = function(req, res){
    const new_hub = new Hub({
        name: req.body.name,
        owner: req.body.owner,
        location: req.body.location,
    })
    new_hub.save().then(function(savedHub){
        var resObj = {}
        resObj.message = "Successfully created Hub";
        resObj.name = savedHub.name;
        return res.status(201).json(resObj);
    }).catch(function(err){
        var errObj = {}
        errObj.message = err.message;
        return res.status(400).json(errObj);
    })

};

exports.get_hub_bookings = async function(req, res){
    var hub_id = req.params.id;
    resObj = {}
    resObj.message = `No bookings in Hub: ${hub_id}`;
    
    try{
        var hub = await Hub.findById(hub_id)
        if(!hub){
            return res.status(403).json({'message': 'Invalid Hub!'});
        }
        var booking = await Booking.find({$or:[{'from_hub': hub_id}, {'to_hub':hub_id}]})
        
            if(booking.length != 0){
                resObj.status = 200;
                resObj.message = `Retreived bookings in Hub ${hub_id}`;
                resObj.bookings = booking   
            }
            else{
                resObj.status = 404;
                resObj.message = "No booking found"
            }
            return res.status(resObj.status).json(resObj);
    }

    catch(err){
        
        resObj.message = "Internal server occured."
        resObj.error = err.message;
        return res.status(500).json(resObj);
        
    }

    
};


exports.hub_detail = function(req, res){
    const hub_id = req.params.id;
    Hub.findOne({_id: hub_id})
    .populate('owner', ['name'])
    .select()
    .exec()
    .then(function(hub_instance){
        if (hub_instance != null)
        {
            var resObj = {}
            resObj.status = 200;
            resObj.hub = hub_instance;
            return res.status(200).json(resObj) 
        }
        else{
            return res.status(404).json({message: "Invalid Hub ID"})
        }
    })
    .catch(function(err){
        var errObj = {}
        
        errObj.message = err.message;
        
        return res.status(errObj.status).json(errObj);
    })
}


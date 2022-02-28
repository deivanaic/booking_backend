var Booking = require('../models/bookingModel');
var Hub =  require('../models/hub')

exports.get_all_bookings = async function(req, res){
    user_id = req.user.id;
    user_type = req.type;
    resObj = {}
    resObj.bookingList = []
    const {page=1, limit=3} = req.query;
    if (page == 0) {
        return res.status(403).json({"message":"page size should be greater than 0"})
    }
    try {
        var bookings = await Booking.find({$or:[{Partner: req.user}, {client: user_id}]})
        .limit(limit*1)
        .skip((page-1)*limit)
        
        if (bookings && bookings.length != 0){
            resObj.status = 200;
            resObj.message = "Successfully retreived all bookings"
            resObj.bookingList = bookings
            }
        else{
            resObj.bookingList = []
            resObj.status = 200
        }
            
        return res.status(resObj.status).json(resObj);
    }
    catch(err){
        resObj.status = 500;
        resObj.message = "Internal server issue";
        resObj.error = err;
        return res.status(resObj.status).json(resObj);
    }
};

exports.apply_booking = function(req, res){
    booking_id = req.params.id;
    user_type = req.type;
    partner_user = req.user;
    if(user_type != 'Partner'){
        var resObj = {}
        resObj.status = 403;
        resObj.message = "Forbidden! Only Partners can apply for a booking";
        return res.status(resObj.status).json(resObj);
    }
    else{
        Booking.findOneAndUpdate({"_id":booking_id, "status":{$eq:"created"}}, 
            {status: "assigned",
             updated_at: new Date().toISOString(),
             Partner: partner_user
            }, {new: true})
        .then(function(booking){
            var resObj = {}
            if (booking){
                resObj.status = 200;
                resObj.message = "Successfully applied booking"
                resObj.booking = booking
            }
            else{
                resObj.status = 404;
                resObj.message = "Invalid Booking ID/ Booking has already been assigned"
            }
            
            return res.status(resObj.status).json(resObj);
        })
        .catch(function(err){
            var resObj = {}
            resObj.status = 500;
            resObj.message = "Internal server issue";
            resObj.error = err;
            return res.status(resObj.status).json(resObj);
        })
    }
};

exports.create_booking = async function(req, res){
    var user_type = req.type;
    if(user_type != 'Client'){
        var errObj = {}
        errObj.status = 403;
        errObj.message = "Only Clients can create a booking";
        return res.status(errObj.status).json(errObj);
    }
    else{
        var from_hub_id = req.body.from_hub;
        var to_hub_id = req.body.to_hub;
        source = await Hub.findById(from_hub_id)
        if (!source){
                var errObj = {};
                errObj.status = 403;
                errObj.message = `Cant make a booking as Source Hub with ID ${from_hub_id} doesnt exist`;
                return res.status(errObj.status).json(errObj);
            }
        }

        dest = await Hub.findById(to_hub_id)
        
        if(!dest){
            var errObj = {};
            errObj.status = 403;
            errObj.message = `Cant make a booking as Destination Hub with ID ${from_hub_id} doesnt exist`;
            return res.status(errObj.status).json(errObj); 
        }

        new_booking = await new Booking(req.body);
        new_booking.client = req.user;
        new_booking.status = "created";
        new_booking.save()
        .then(function(saved_booking){
            var resObj = {}
            resObj.status = 201;
            resObj.booking = saved_booking;
            return res.status(201).json(resObj);
        })
        .catch(function(err){
            return res.status(500).json({error: err});
        })

    };


exports.booking_detail = function(req, res){
    booking_id = req.params.id;
    var resObj = {};
    resObj.status = 404;
    resObj.message = `Booking with ID ${booking_id} doesnt exist`;
    Booking.findById(booking_id)
    .then(function(found){
        if (found){
            resObj.status = 200;
            resObj.message = `Successfully retreived Booking ID : ${booking_id}`;
            resObj.booking = found;
        }
        return res.status(resObj.status).json(resObj);
    })
    .catch(function(err){
        resObj.status = 500
        resObj.message = "Internal Server occured. Please try again later";
        resObj.err = err.message;
        return res.status(resObj.status).json(resObj);
    })

};

exports.complete_trip = function(req, res){
    booking_id = req.params.id;
    user_type = req.type;
    partner_user = req.user;
    if(user_type != 'Partner'){
        var resObj = {}
        resObj.status = 403;
        resObj.message = "Forbidden! Only Partners can complete trip";
        return res.status(resObj.status).json(resObj);
    }
    else{
        Booking.findOneAndUpdate({"_id": booking_id, "status": {$eq:"in_progress"}, "Partner": {$eq: partner_user}}, 
            {status:"completed",
            trip_endtime: new Date().toISOString(),
            }, {new:true})
        .then(function(booking){
            var resObj = {}
            if (booking){
                resObj.status = 200;
                resObj.message = "Successfully completed trip"
                resObj.booking = booking
            }
            else{
                resObj.status = 404;
                resObj.message = "Invalid Booking ID / Trip has not started"
            }
            
            return res.status(resObj.status).json(resObj);
        })
        .catch(function(err){
            var resObj = {}
            resObj.status = 500;
            resObj.message = "Internal server issue";
            resObj.error = err;
            return res.status(resObj.status).json(resObj);
        })
    }
};

exports.start_trip = function(req, res){
    booking_id = req.params.id;
    user_type = req.type;
    partner_user = req.user;
    if(user_type != 'Partner'){
        var resObj = {}
        resObj.status = 403;
        resObj.message = "Forbidden! Only Partners can start a trip";
        return res.status(resObj.status).json(resObj);
    }
    else{
        Booking.findOneAndUpdate({"_id": booking_id, "status":{$eq:"assigned"}, "Partner":{$eq: partner_user}}, 
            {status:"in_progress",
            trip_starttime: new Date().toISOString(),
            }, {new: true})
        .then(function(booking){
            var resObj = {}
            if (booking){
                resObj.status = 200;
                resObj.message = "Successfully started a trip"
                resObj.booking = booking
            }
            else{
                resObj.status = 404;
                resObj.message = "Invalid Booking ID / Trip has not been assigned"
            }
            
            return res.status(resObj.status).json(resObj);
        })
        .catch(function(err){
            var resObj = {}
            resObj.status = 500;
            resObj.message = "Internal server issue";
            resObj.error = err;
            return res.status(resObj.status).json(resObj);
        })
    }
};
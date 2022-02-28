var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookingSchema = new Schema({
    client: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    Partner: {type: Schema.Types.ObjectId, default: null},
    from_hub: {type: Schema.Types.ObjectId, required: true, ref: 'Hub'},
    to_hub: {type: Schema.Types.ObjectId, required: true, ref: 'Hub'},
    status: {type: String, required: true, enum: ['created', 'assigned', 'cancelled', 'in_progress', 'completed', 'expired']},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: null},
    trip_starttime: {type: Date, default: null},
    trip_endtime: {type:Date, default: null}

});
BookingSchema.virtual('url').get(function(){
    return '/booking/'+this._id;
})
module.exports = mongoose.model('Booking', BookingSchema);
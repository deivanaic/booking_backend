var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var BookingSchema = new Schema({
    client: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    created_by: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
    from_hub: {type: Schema.Types.ObjectId, required: true, ref: 'Hub'},
    to_hub: {type: Schema.Types.ObjectId, required: true, ref: 'Hub'},
    status: {type: String, required: true, enum: ['created', 'assigned', 'cancelled', 'in_progress', 'completed', 'expired']},
    start_time: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});
BookingSchema.virtual('url').get(function(){
    return '/booking/'+this._id;
})
module.exports = mongoose.model('Booking', BookingSchema);
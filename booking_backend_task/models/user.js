var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var UserSchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    active: {type: Boolean, default: true},
    phone: {type: Number, required: true, minLength: 9, maxLength:9},
    type: {type: String, required: true, enum: ['Client', 'Partner']},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now}
});
UserSchema.virtual('url').get(function(){
    return '/user/'+this._id;
})
module.exports = mongoose.model('User', UserSchema);
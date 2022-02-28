var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;
var HubSchema = new Schema({
    name: {type: String, required: true, maxLength: 100, unique: true},
    owner: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    location: { 
        type: {type: String, default: 'Point'},
        coordinates: {type: [Number], default: [0,0]}
}
});
HubSchema.virtual('url').get(function(){
    return '/hub/'+this._id;
})
HubSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Hub', HubSchema);
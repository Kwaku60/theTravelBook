const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredNumber = { type: Number, required: true}
const requiredDate = {type: Date, default: Date.now }


const logEntrySchema = new Schema({
    title: {  
        type: String, 
        required: true,   //validate what is going into this schema, before insertion  
    },
    description: String,
    comments: String,
    image: String,
    rating: {
        type: Number,
        min: 0, //custom error message
        max: 10,
        default: 0,
    },
    latitude: {
        ...requiredNumber,
        min: -90,
        max: 90,
    },
    longitude: {
        ...requiredNumber,
        min: -180,
        max: 180,
    },
    visitDate: {
        required: true,
        type: Date,
    },
}, {
    timestamps: true,
});
//exporting as mongoose model so we can have access to some mongoose methods   
const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
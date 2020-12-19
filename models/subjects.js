var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var subjectSchema = new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    tags: [String]
},{
    timestamps:true
});

var subject = mongoose.model("subjects", subjectSchema);

module.exports = subject;
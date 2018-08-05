var mongoose = require('mongoose');

//Set up MongoDb connection
function _init(){
    try{
        // return mongoose.createConnection('mongodb://localhost:27017/abacus');
        return mongoose.createConnection('mongodb://admin:Abcd123$0@ds213612.mlab.com:13612/heroku_49cdczxx');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;

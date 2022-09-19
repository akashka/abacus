var mongoose = require('mongoose');

//Set up MongoDb connection
function _init(){
    try{
        // Local
        // return mongoose.createConnection('mongodb://localhost:27017/abacus');
        
        // Stag
        // return mongoose.createConnection('mongodb://admin:Abcd123$0@ds213612.mlab.com:13612/heroku_49cdczxx');

        // Live
        return mongoose.createConnection('mongodb://akash:akash@cluster0.shyoqs4.mongodb.net/aloha-abacus');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;

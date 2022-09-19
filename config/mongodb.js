var mongoose = require('mongoose');

//Set up MongoDb connection
function _init(){
    try{
        // Local
        // return mongoose.createConnection('mongodb://localhost:27017/abacus');
        
        // Stag
        // return mongoose.createConnection('mongodb://admin:Abcd123$0@ds213612.mlab.com:13612/heroku_49cdczxx');

        // Live
        return mongoose.createConnection('mongodb://akash:abcd1234@cluster-7bl0f9cp-shard-00-00.txl42.mongodb.net:27017,cluster-7bl0f9cp-shard-00-01.txl42.mongodb.net:27017,cluster-7bl0f9cp-shard-00-02.txl42.mongodb.net:27017/heroku_7bl0f9cp?authSource=admin&replicaSet=atlas-eel26w-shard-0&w=majority%22&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;

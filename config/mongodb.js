var mongoose = require('mongoose');

//Set up MongoDb connection
function _init(){
    try{
        // Local
        // return mongoose.createConnection('mongodb://localhost:27017/abacus');
        
        // Stag
        // return mongoose.createConnection('mongodb://admin:Abcd123$0@ds213612.mlab.com:13612/heroku_49cdczxx');

        // Live
        return mongoose.createConnection('mongodb://admin:abcd1234@cluster0-shard-00-00.cjv0p.mongodb.net:27017,cluster0-shard-00-01.cjv0p.mongodb.net:27017,cluster0-shard-00-02.cjv0p.mongodb.net:27017/alohaindia?ssl=true&replicaSet=atlas-xm4jo5-shard-0&authSource=admin&retryWrites=true&w=majority');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;

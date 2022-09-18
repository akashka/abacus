var mongoose = require('mongoose');

//Set up MongoDb connection
function _init(){
    try{
        // Local
        // return mongoose.createConnection('mongodb://localhost:27017/abacus');
        
        // Stag
        // return mongoose.createConnection('mongodb://admin:Abcd123$0@ds213612.mlab.com:13612/heroku_49cdczxx');

        // Live
        return mongoose.createConnection('mongodb://akash:Abcd123$0@ac-ao8t6fk-shard-00-00.shyoqs4.mongodb.net:27017,ac-ao8t6fk-shard-00-01.shyoqs4.mongodb.net:27017,ac-ao8t6fk-shard-00-02.shyoqs4.mongodb.net:27017/test?replicaSet=atlas-fblq6e-shard-0&ssl=true&authSource=admin');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;

var mongoose = require('mongoose');

//Set up MongoDb connection
function _init(){
    try{
        return mongoose.createConnection('mongodb://localhost:27017/abacus');
        //return mongoose.createConnection('mongodb://han_solo:chewbacca@ds011419.mlab.com:11419/mean-boilerplate-test');
    }catch(err){
        console.log("No internet connection :(");
    }
};

module.exports.init = _init;

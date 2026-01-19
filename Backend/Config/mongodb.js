const mongoose =require('mongoose');

async function connectDB(){
    try{
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Mongoose Connected");
    }
    catch(err){
        console.log("error occurecd",err)

    }
}

module.exports=connectDB; //while importing no need of object desctruction as single export consider as default 
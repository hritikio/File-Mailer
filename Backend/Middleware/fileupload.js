const multer =require('multer');

const storage =multer.memoryStorage();
//uses ram to store buffer of file 

const upload=multer({
    storage,
    limits:{
        fileSize:25*1024*1024 //max 25MB
    }
})

module.exports=upload;
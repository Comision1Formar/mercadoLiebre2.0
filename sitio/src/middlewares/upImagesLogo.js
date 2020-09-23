const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,'public/images/logos')
    },
    filename:(req,file,callback)=>{
        callback(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

const fileFilter = function(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        req.fileValidatorError = "Only Images";
        return cb(null,false,req.fileValidatorError);
    }
    cb(null,true)
}

module.exports = multer({
    storage:storage,
    fileFilter:fileFilter
});
const fs = require('fs');
const path = require('path');
const multer = require('multer');

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './public/uploads/';
    
    // Create directory if not exists
    fs.mkdir(uploadDir, { recursive: true }, (err) => {
      if (err) return cb(err);
      cb(null, uploadDir);
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: diskStorage });
module.exports = upload; 



// const diskStorage1 = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         const uploadDir =
//     }
// }) 
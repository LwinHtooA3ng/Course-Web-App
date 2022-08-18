// const multer = require("multer");

// const imageFilter = (req, file, cb ) => {
//     console.log("Your file ---- " + file);
//     if(file.mimetype.startsWith("image")){
//         cb(null, true);
//     }else{
//         cb("Please upload only images.", false)
//     }
// }


// var storage = multer.diskStorage({
//     destination: (req, file, cb ) => {
//         cb(null, __basedir + "/resources/static/assets/uploads/");
//     },
//     filename: (req, file, cb ) => {
//         cb(null, `${Date.now()}-bezkoder-${file.originalname}`);
//     }
// })

// var uploadFile = multer({storage: storage});

// module.exports = uploadFile;

// const util = require("util");
// const multer = require("multer");

// const maxSize = 2 * 1024 * 1024;

// var myFile = "";

// const imageFilter = (req, file, cb) => {
//     if (file.mimetype.startsWith("image")) {
//       cb(null, true);
//     } else {
//       cb("Please upload only images.", false);
//     }
// };

// let storage = multer.diskStorage({
//     destination: (req, file, cb ) => {
//         cb(null, __basedir + "/resources/static/assets/uploads/")
//     },
//     filename: (req, file, cb ) => {
//         cb(null, file.originalname);
//         this.myFile = file.originalname
//         // cb(null, `${Date.now()}-${file.originalname}`);
//         // this.myFile = `${Date.now()}-${file.originalname}`
//     }
// })

// let uploadFile = multer({
//     storage: storage,
//     // fileFilter : imageFilter,
//     limits: { fileSize: maxSize },
// }).single("file");

// let uploadFileMiddleware = util.promisify(uploadFile);

// // module.exports = uploadFileMiddleware;
// module.exports = [
//     uploadFileMiddleware,
//     myFile
// ]

const util = require("util");
const multer = require("multer");

const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: (req, file, cb ) => {
        // cb(null, __basedir + "/resources/static/assets/uploads/")
        cb(null, __basedir + "/resources/courses/")
    },
    filename: (req, file, cb ) => {
        console.log(file.originalname);
        cb(null, Date.now()+"-"+file.originalname);
    }
})

let uploadFile = multer({
    storage: storage,
    limits: { fileSize: maxSize },
}).single("file");

let uploadFileMiddleware = util.promisify(uploadFile);

module.exports = uploadFileMiddleware;


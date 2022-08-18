const fs = require("fs");

const db = require("../models");

const Image = db.image;

const baseUrl = "http://localhost:8080/files/";

const uploadFile = require("../middleware/upload")

const upload = async (req, res) => {
    try {
        await uploadFile(req, res);
        if (req.file == undefined) {
            return res.status(200).send({
                message: "Please upload a file!",
                code: 430

            });
        }
        res.status(200).send({
            message: "Uploaded the file successfully : " + req.file.filename,
            url: baseUrl + req.file.filename,
            code: 200
        })
    } catch (err) {
        if (err.code == "LIMIT_FILE_SIZE") {
            return res.send({
                message: "File size cannot be larger than 2MB!",
                code : 431
            });
        }
        res.status(500).send({
            message: `Could not upload the file : ${req.file.originalname}.${err}`
        })
    }
}


// const uploadFile = require("../middleware/upload")

// const upload = async (req, res) => {
//     try {
//         await uploadFile(req, res);
//         if (req.file == undefined) {
//             return res.status(200).send({
//                 message: "Please upload a file!",
//                 code: 430

//             });
//         }
//         res.status(200).send({
//             message: "Uploaded the file successfully : " + req.file.originalname,
//             url: baseUrl + req.file.originalname,
//             code: 200
//         })
//     } catch (err) {
//         if (err.code == "LIMIT_FILE_SIZE") {
//             return res.send({
//                 message: "File size cannot be larger than 2MB!",
//                 code : 431
//             });
//         }
//         res.status(500).send({
//             message: `Could not upload the file : ${req.file.originalname}.${err}`
//         })
//     }
// }

const getListFiles = (req, res) => {
    const directoryPath = __basedir + "/resources/courses/";
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            res.status(500).send({
                message: "Unable to scan files!",
            })
        }
        let fileInfos = [];
        files.forEach((file) => {
            fileInfos.push({
                name: file,
                url: baseUrl + file,
            })
        })
        res.status(200).send(fileInfos)
    })
}

const download = (req, res) => {
    const fileName = req.params.name;
    const directoryPath = __basedir + "/resources/courses/";
    res.download(directoryPath + fileName, fileName, (err) => {
        if (err) {
            res.status(500).send({
                message: "Could not download the file." + err,
            })
        }
    })
}

module.exports = {
    upload,
    getListFiles,
    download
}
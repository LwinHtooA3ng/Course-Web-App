const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js")

const db = require("../models")

const User = db.user;
const Course = db.course;
const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
    if(err instanceof TokenExpiredError){
        return res.send({message: "Unauthorized! Access Token was expired!", code: 418})
    }
    return res.send({message: "Unauthorized!, your access token is false.", code: 419})
}

verifyToken = (req, res, next) => {

    let token = req.headers["x-access-token"];

    if(!token){
        return res.send({
            message: "No token provided!",
            code: 420
        })
    }

    jwt.verify(token, config.secret, (err, decoded) => {

        if(err){
            return catchError(err, res);
        }

        req.userId = decoded.id;
        // req.userName = decoded.username
        next();
    })

}

isOwnCourse = (req, res, next) => {

    const id = req.params.id;

    Course.findByPk(id, {include: ["user"]})
    .then(data => {
        const user = data.user.id
        if(user == req.userId){
            next();
            return;
        }
        res.send({
            message: "This isn't your own course.",
            code: 421
        })
        return;
    })
    .catch(err => {
        res.status(404).send({
            message: "This course not found. id = "+ id,
            error : err
        })
    })

}

isOwnCourseOrAdmin = async (req, res, next) => {
    myid = ""
    const id = req.params.id;

    await Course.findByPk(id, {include: ["user"]})
    .then(data => {
        if(data){
            this.myid = data.user.id

            User.findByPk(req.userId).then(user => {
                user.getRole().then(roles => {
                    if(roles.name === "admin"){
                        next();
                        return;
                    }
                    if(this.myid == req.userId){
                        next();
                        return;
                    }
                    res.send({
                        message: "Require Admin Role!",
                        code: 423
                    })
                    return;
                })
            })
        }
        if(!data){
            res.send({message: "Can not find this course."})
        }
        
    })

    // User.findByPk(req.userId).then(user => {
    //     user.getRole().then(roles => {
    //         if(roles.name === "admin"){
    //             next();
    //             return;
    //         }
    //         if(this.myid == req.userId){
    //             next();
    //             return;
    //         }
    //         res.write({
    //             message: "Require Admin Role!",
    //             code: 423
    //         })
    //         res.send()
    //         return;
    //     })
    // })
}

isUser = (req, res, next) => {
    const id = req.params.id;

    if (id == req.userId){
        next();
        return;
    }
    res.send({
        message: "Can't show.",
        code: 422
    })
}

isAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRole().then(roles => {
            if(roles.name === "admin"){
                next();
                return;
            }
            res.send({
                message: "Require Admin Role!",
                code: 423
            })
            return;
        })
    })
}

isModerator = (req, res, next) => {
    User.findByPk(req.userId)
    .then(user => {
        user.getRole().then(roles => {
            if(roles.name === "moderator"){
                next();
                return;
            }
            res.send({
                message: "Require Moderator Role!",
                code: 424
            })
        })
    })
}

isModeratorOrAdmin = (req, res, next) => {
    User.findByPk(req.userId).then(user => {
        user.getRole().then(roles => {
            if(roles.name === "admin"){
                next();
                return;
            }
            if(roles.name === "moderator"){
                next();
                return;
            }
            res.send({
                message: "Require Moderator or Admin Role!",
                code: 425
            })
        })
    })
}

const authJwt = {
    verifyToken: verifyToken,
    isAdmin: isAdmin,
    isModerator: isModerator,
    isModeratorOrAdmin: isModeratorOrAdmin,
    isOwnCourse: isOwnCourse,
    isUser: isUser,
    isOwnCourseOrAdmin:isOwnCourseOrAdmin
};

module.exports = authJwt;
const db = require("../models");

const ROLES = db.ROLES;

const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {

    if(req.body.role || req.body.role == "") {
        return res.send({message: "Cann't set roles.",code: 408})
    }

    if(!req.body.username){
        return res.send({message: "Username is required!", code: 400})
    }

    if(!req.body.fullName){
        return res.send({message: "Full Name is required!", code: 400})
    }

    if(!req.body.email){
        return res.send({message: "Email is required!", code: 400})
    }

    if(!req.body.password){
        return res.send({message: "Password is required!", code: 400})
    }

    function hasWhiteSpace(s) {
        return /\s/g.test(s);
    }

    if(hasWhiteSpace(req.body.username)){
        return res.send({message: "Username can not contain white space.", code: 410})
    }

    if(hasWhiteSpace(req.body.email)){
        return res.send({message: "Email can not contain white space.", code: 411})
    }

    if(hasWhiteSpace(req.body.password)){
        return res.send({message: "Password can not contain white space.", code: 412})
    }

    User.findOne({
        where: {
            username: req.body.username
        }
    })
    .then(user => {
        if(user){
            res.send({
                message: "Username is already in use!",
                code: 413
            });
            return;
        }

        // email
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if(user){
                res.send({
                    message: "Email is already in use!",
                    code: 414
                });
                return;
            }
            next();
        })

    })

}

// for multi role
// checkRolesExisted = (req, res, next) => {
//     if(req.body.roles) {
//         for(let i=0; i< req.body.roles.length; i++) {
//             if(!ROLES.includes(req.body.roles[i])){
//                 res.status(200).send({
//                     message: "Failed! Role does not exist = " + req.body.roles[i],
//                     code: 403
//                 });
//                 return;
//             }
//         }
//     }
//     next();
// }


// for single role
checkRolesExisted = (req, res, next) => {
    if(req.body.role) {
        if(!ROLES.includes(req.body.role)){
            res.status(400).send({
                message: "Failed! Role does not exist = " + req.body.role,
                code: 415
            });
            return;
        }
    }
    next();
}

const verifySignUp = {
    checkDuplicateUsernameOrEmail: checkDuplicateUsernameOrEmail,
    checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;
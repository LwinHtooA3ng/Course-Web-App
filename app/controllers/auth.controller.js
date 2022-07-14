const db = require("../models");

const config = require("../config/auth.config");

// const User = db.user;

// const Role = db.role;

const {
    user: User,
    role: Role
} = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken")

var bcrypt = require("bcryptjs")

// exports.signup = (req, res) => {

//     User.create({
//             username: req.body.username,
//             email: req.body.email,
//             password: bcrypt.hashSync(req.body.password, 8)
//         })
//         .then(user => {
//             if (req.body.roles) {
//                 Role.findAll({
//                         where: {
//                             name: {
//                                 [Op.or]: req.body.roles
//                             }
//                         }
//                     })
//                     .then(roles => {
//                         user.setRoles(roles).then(() => {
//                             res.send({
//                                 message: "User was registered successfully!"
//                             })
//                         })
//                     })
//             } else {
//                 user.setRoles([1]).then(() => {
//                     res.send({
//                         message: "User was registered successfully!"
//                     })
//                 })
//             }
//         })
//         .catch(err => {
//             res.send(500).send({
//                 message: err.message
//             })
//         })

// }

exports.signup = (req, res) => {

    User.create({
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8)
        })
        .then(user => {
            user.setRole(1).then(() => {
                res.send({
                    message: "User was registered successfully!",
                    code: 200
                })
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message,
                error: err
            })
        })

}

exports.signin = (req, res) => {

    if (!req.body.username) {
        return res.status(200).send({
            message: "Username is required!",
            code: "400"
        })
    }

    if (!req.body.password) {
        return res.status(200).send({
            message: "Password is required!",
            code: "400"
        })
    }

    User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(async (user) => {
            if (!user) {
                return res.send({
                    message: "User not found.",
                    code: 416
                })
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.send({
                    message: "Invalid Password!",
                    code: 417
                })
            }

            var authorities = [];

            var role = ""

            var token = jwt.sign({
                id: user.id,
                email: user.email
            }, config.secret, {
                expiresIn: config.jwtExpiration
            })

            user.getRole().then(roles => {
                for (let i = 0; i < roles.length; i++) {
                    authorities.push("ROLE_" + roles[i].name.toUpperCase());
                }
                // res.send({message: roles.name})
                res.status(200).send({
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    email: user.email,
                    roles: roles.name,
                    accessToken: token,
                    code:200
                })
            })


        })
        .catch(err => {
            res.status(500).send({
                message: err.message
            })
        })
}
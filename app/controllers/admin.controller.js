const db = require("../models");

const config = require("../config/auth.config");

const User = db.user;

const Role = db.role;

const Course = db.course;

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? + size : 3;
    const offset = page ? page * limit : 0;
    return { limit, offset }
}

const getPagingData = (data, page, limit) => {
    const {count: totalItems, rows: users} = data;
    const currentPages = page? page : 0;
    const totalPages = Math.floor(totalItems / limit);
    return { totalItems, users, totalPages, currentPages }
}

const getPagingCourse = (data, page, limit) => {
    const {count: totalItems, rows: courses} = data;
    const currentPages = page? page : 0;
    const totalPages = Math.floor(totalItems / limit);
    return { totalItems, courses, totalPages, currentPages }
}

exports.findAllCoursesIncludeUser = (req, res) => {

    const { page, size, username } = req.query;
    const {limit, offset} = getPagination(page, size)
    Course.findAndCountAll({
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["username"]
                }
            ],
            attributes: {exclude: ['id', 'createdAt', 'updatedAt', 'userId']},
            limit, offset
            // include: ["user"]
        })
        .then(data => {
            const response = getPagingCourse(data, page, limit);
            res.send(response)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving tutorials."
            })
        })
}

exports.deleteUser = (req, res) => {
    id = req.params.id

    User.destroy({
        where: {
            id: id
        }
    })
    .then(num => {
        if (num == 1) {
            res.status(200).send({
                message: "User was delete successfully!",
                code: 200
            })
        } else {
            res.send({
                message: `Cannot delete User with id=${id}. Maybe User was not found!`,
                code: 427
            })
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete User with id=" + id,
            error : err
        });
    });
}

exports.Alluser = (req, res) => {

    const { page, size, username } = req.query;
    const { limit, offset } = getPagination(page, size)
    var condition = username ? {username: {[Op.like]: `%${username}%`}} : null
    User.findAndCountAll({
            where: condition,
            include: [{
                model: Role,
                as: "role",
                attributes: ["name"]
            }],
            attributes: {
                exclude: ["createdAt", "updatedAt", "roleId"]
            },
            limit,
            offset
        })
        .then(user => {
            const response = getPagingData(user, page, limit);
            res.send(response)
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving all users."
            })
        })
}

exports.updateRole = (req, res) => {

    const id = req.params.id;

    if(!req.body.role){
        return res.status(200).send({
            message: "Role is required",
            code: 400
        })
    }

    // if(req.body.role == "admin"){
    //     return res.status(200).send({
    //         message: "Cann't update admin role.",
    //         code: 408
    //     })
    // }

    if (req.body.username || req.body.password) {
        return res.status(200).send({
            message: "You can update only role.",
            code: 408
        })
    }

    var upRole = 0

    if (req.body.role == "user") {
        this.upRole = 1
    }

    if (req.body.role == "moderator") {
        this.upRole = 2
    }

    if (req.body.role == "admin") {
        this.upRole = 3
    }

    User.update({
            roleId: this.upRole
        }, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "User was updated.",
                    code: 200
                })
            } else {
                res.status(200).send({
                    message: "Cann't update this user.",
                    code: 428
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error occur while updating user.",
                error: err
            })
        })

}


// exports.updateUser = (req, res) => {

//     const id = req.params.id;


//     User.update({
//         username: req.body.username,
//         roleId: 2
//     }, {
//         where: {id: id}
//     })
//     .then(num => {
//         if(num == 1){
//             res.status(200).send({message: "User was updated."})
//         }
//         else{
//             res.status(200).send({
//                 message: "Cann't update this user."
//             })
//         }
//     })
//     .catch(err => {
//         res.status(500).send({
//             message: "Error occur while updating user." + err
//         })
//     })

// }

// exports.Alluser = (req, res) => {

//     User.findAll({
//             include: [{
//                 model: Role,
//                 as: "role",
//                 attributes: ["name"]
//             }],
//             attributes: {
//                 exclude: ["createdAt", "updatedAt", "roleId"]
//             }
//         })
//         .then(user => {
//             res.status(200).send(user);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving all users."
//             })
//         })
// }
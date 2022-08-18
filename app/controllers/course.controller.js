const {
    user
} = require("../models");
const db = require("../models")
const fs = require('fs')

const Course = db.course;

const User = db.user

const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
    const limit = size ? +size : 4;
    const offset = page ? page * limit : 0;
    return {
        limit,
        offset
    }
}

const getPagingData = (data, page, limit) => {
    const {
        count: totalItems,
        rows: courses
    } = data;
    const currentPages = page ? page : 0;
    const totalPages = Math.floor(totalItems / limit);
    return {
        totalItems,
        courses,
        totalPages,
        currentPages
    }
}

exports.courseCreate = (req, res) => {

    if (!req.body.title) {
        res.send({
            message: "Title can not be empty!",
            code: 426
        });
        return;
    }

    if (!req.body.image) {
        res.send({
            message: "Image can not be empty!",
            code: 429
        });
        return;
    }

    const course = {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        userId: req.userId
    }

    Course.create(course)
        .then(data => {
            res.send({
                message: "Your cource was created.",
                code: 200
            })
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occured while creating course."
            })
        })

}

exports.findAllCoursesIncludeUser = (req, res) => {

    const {
        page,
        size,
        courseTitle
    } = req.query;

    const {
        limit,
        offset
    } = getPagination(page, size)

    var condition = courseTitle ? {
        title: {
            [Op.like]: `%${courseTitle}%`
        }
    } : null;
    Course.findAndCountAll({
            where: condition,
            include: [{
                model: User,
                as: "user",
                attributes: ["fullName"]
            }],
            attributes: {
                exclude: ['createdAt', 'updatedAt', 'userId']
            },
            limit,
            offset
            // include: ["user"]
        })
        .then(data => {
            const response = getPagingData(data, page, limit);
            res.send(response)
        })
        .catch(err => {
            res.status(500).send({
                message: "Some error occurred while retrieving tutorials.",
                error: err.message
            })
        })
}

// exports.findAllCoursesIncludeUser = (req, res) => {

//     Course.findAll({
//             include: [
//                 {
//                     model: User,
//                     as: "user",
//                     attributes: ["username"]
//                 }
//             ],
//             attributes: {exclude: ['id', 'createdAt', 'updatedAt', 'userId']}
//             // include: ["user"]
//         })
//         .then(data => {
//             res.status(200).send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving tutorials."
//             })
//         })
// }

exports.findOneUserIncludeCourses = (req, res) => {

    const id = req.params.id;
    User.findByPk(id, {
            include: [{
                model: Course,
                as: "courses",
                attributes: ["id", "title", "description", "image"]
            }],
            attributes: {
                exclude: ['username', 'email', 'createdAt', 'updatedAt', 'password', 'id', 'roleId']
            }
        })
        .then(data => {
            if (data) {
                res.status(200).send(data);
            } else {
                res.send({
                    message: "User not found",
                    code: 416
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error while retrieving user.",
                error: err.message
            })
        })
}

exports.findOneCourse = (req, res) => {

    const id = req.params.id;

    Course.findByPk(id, {
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"]
            }
        })
        .then(data => {
            if (data) {
                res.status(200).send(data)
            } else {
                res.send({
                    message: `Cannot find course with id = ${id}`,
                    code: 404
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id,
                error: err.message
            });
        });

}

exports.updateCourse = (req, res) => {

    const id = req.params.id;

    if (!req.body.title) {
        res.send({
            message: "Title can not be empty!",
            code: 426
        });
        return;
    }

    Course.update(req.body, {
            where: {
                id: id
            }
        })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "Course was updated successfully.",
                    code: 200
                })
            } else {
                res.send({
                    message: `Cannot update Tutorial with id=${id}.Maybe Tutorial was not found or req.body is empty!`,
                    code: 404
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error updating Tutorial with id = " + id,
                error: err.message
            })
        })

}

exports.deleteCourse = (req, res) => {

    // directoryPath = __basedir + "/resources/static/assets/uploads/kelly-sikkema-v9FQR4tbIq8-unsplash (1).jpg";
    // try {
    //     fs.unlinkSync(directoryPath)
    //     //file removed
    // } catch (err) {
    //     console.error(err)
    // }

    const id = req.params.id;

    var directoryPath = ""

    Course.findByPk(id, {
            attributes: {
                exclude: ["createdAt", "updatedAt", "userId"]
            }
        })
        .then(data => {
            if (data) {
                path = data.image
                sperate = path.split("/");
                this.directoryPath = sperate[4];
                Course.destroy({
                        where: {
                            id: id
                        }
                    })
                    .then(num => {
                        if (num = 1) {
                            fs.unlinkSync(__basedir + "/resources/static/assets/uploads/" + sperate[4]);
                            res.status(200).send({
                                message: "Tutorial was delete successfully!",
                                path: directoryPath,
                                code: 200
                            })
                        } else {
                            res.status(200).send({
                                message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
                                code: 404
                            })
                        }
                    })
                    .catch(err => {
                        res.status(500).send({
                            message: "Could not delete Tutorial with id=" + id,
                            error: err.message
                        });
                    });
                // fs.unlinkSync(__basedir + "/resources/static/assets/uploads/" + sperate[4]);
            } else {
                res.send({
                    message: `Cannot find course with id = ${id}`,
                    code: 404
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Tutorial with id=" + id,
                error: err.message
            });
        });

    // Course.destroy({
    //         where: {
    //             id: id
    //         }
    //     })
    //     .then(num => {
    //         if (num = 1) {
    //             fs.unlinkSync(__basedir + "/resources/static/assets/uploads/" + directoryPath);
    //             res.status(200).send({
    //                 message: "Tutorial was delete successfully!",
    //                 path: directoryPath,
    //                 code: 200
    //             })
    //         } else {
    //             res.status(200).send({
    //                 message: `Cannot delete Tutorial with id=${id}. Maybe Tutorial was not found!`,
    //                 code: 404
    //             })
    //         }
    //     })
    //     .catch(err => {
    //         res.status(500).send({
    //             message: "Could not delete Tutorial with id=" + id,
    //             error: err.message
    //         });
    //     });

}


// exports.findUsersIncludeCourses = (req, res) => {
//     User.findAll({
//             include: ["courses"]
//         })
//         .then(data => {
//             res.status(200).send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving tutorials."
//             })
//         })
// }

// exports.findAllCourses = (req, res) => {
//     Course.findAll()
//         .then(data => {
//             res.status(200).send(data);
//         })
//         .catch(err => {
//             res.status(500).send({
//                 message: err.message || "Some error occurred while retrieving tutorials."
//             });
//         });
// }
const controller = require("../controllers/admin.controller.js")

const courseController = require("../controllers/course.controller")

const { authJwt } = require("../middleware");

const { verifySignUp } = require("../middleware");


module.exports = function(app){

    app.use(function(req, res, next){

        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();

    })

    app.get("/api/admin/allUser",[authJwt.verifyToken, authJwt.isAdmin], controller.Alluser)

    app.put("/api/admin/update-role/:id", [authJwt.verifyToken, authJwt.isAdmin, verifySignUp.checkRolesExisted ], controller.updateRole)

    app.get("/api/admin/allCourse", [authJwt.verifyToken, authJwt.isAdmin], controller.findAllCoursesIncludeUser)

    // app.delete("/api/admin/delete-user/:id", [authJwt.verifyToken, authJwt.isAdmin], controller.deleteUser)

    // app.put("/api/course/update-course/:id", [authJwt.verifyToken, authJwt.isAdmin || authJwt.isOwnCourse], courseController.updateCourse)

    // app.delete("/api/course/delete/:id", [authJwt.verifyToken, authJwt.isAdmin], courseController.deleteCourse)

    // app.get("/api/admin/is-admin", controller.isAdmin)

}
const controller = require("../controllers/course.controller");
const { authJwt } = require("../middleware");

const imageController = require("../controllers/image.controller")


module.exports = function (app) {

    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/course/create", [authJwt.verifyToken, authJwt.isModeratorOrAdmin], controller.courseCreate);

    app.get("/api/course/course-user", controller.findAllCoursesIncludeUser)

    app.get("/api/course/user-course/:id", [authJwt.verifyToken, authJwt.isUser], controller.findOneUserIncludeCourses)

    app.get("/api/course/findById/:id", controller.findOneCourse)

    app.put("/api/course/update-course/:id", [authJwt.verifyToken, authJwt.isOwnCourseOrAdmin ], controller.updateCourse)

    app.delete("/api/course/delete/:id", [authJwt.verifyToken, authJwt.isOwnCourseOrAdmin], controller.deleteCourse)

    // app.get("/api/course/user-course", controller.findUsersIncludeCourses)

    // app.get("/api/course/courses", controller.findAllCourses);

    app.post("/upload",[authJwt.verifyToken,authJwt.isModeratorOrAdmin], imageController.upload);

    app.get("/files", imageController.getListFiles)

    app.get("/files/:name", imageController.download);

}
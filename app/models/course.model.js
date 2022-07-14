const { v4: uuidv4 } = require("uuid")

module.exports = (sequelize, Sequelize) => {
    const Course = sequelize.define("courses", {
        title: {
            type: Sequelize.STRING(100)
        },
        description: {
            type: Sequelize.STRING
        },
        image: {
            type: Sequelize.STRING
        }
    });

    return Course;
};
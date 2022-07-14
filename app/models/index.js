const config = require("../config/db.config.js");

const Sequelize = require("sequelize")

const sequelize = new Sequelize(
    config.DB,
    config.USER,
    config.PASSWORD, {
        host: config.HOST,
        dialect: config.dialect,
        operatorsAliases: false,
        pool: {
            max: config.pool.max,
            min: config.pool.min,
            acquire: config.pool.acquire,
            idle: config.pool.idle
        }
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("../models/user.model.js")(sequelize, Sequelize);

db.role = require("../models/role.model.js")(sequelize, Sequelize);

db.course = require("../models/course.model.js")(sequelize, Sequelize);

// db.image = require("../models/image.model.js")(sequelize, Sequelize)

// db.role.belongsToMany(db.user, {
//     through: "user_roles",
//     foreignKey: "roleId",
//     otherKey: "userId"
// })

// db.user.belongsToMany(db.role, {
//     through: "user_roles",
//     foreignKey: "userId",
//     otherKey: "roleId"
// })

db.role.hasMany(db.user, {as: "users"})

db.user.belongsTo(db.role, {
    foreignKey: "roleId",
    as: "role",
})

db.user.hasMany(db.course, {as: "courses"})

db.course.belongsTo(db.user, {
    foreignKey: "userId",
    as: "user",
})

// db.course.hasOne(db.image, {as: "course"})

// db.image.hasOne(db.course, {as: "image"})

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
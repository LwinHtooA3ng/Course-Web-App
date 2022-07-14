module.exports = (sequelize, Sequelize) => {
    const Image = sequelize.define("image", {
        type: {
            type: Sequelize.STRING
        },
        name: {
            type: Sequelize.STRING
        }
    });
    return Image;
};
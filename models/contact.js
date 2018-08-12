module.exports = function (sequelize, DataTypes) {
    var EmergencyContact = sequelize.define("EmergencyContact", {
    contact_name: DataTypes.TEXT,
    contact_email: DataTypes.TEXT,
    contact_phone: DataTypes.TEXT,
    contact_description: DataTypes.TEXT
    }, {
    freezeTableName: true
    });
    EmergencyContact.associate = function (models) {
    // We're saying that a EmergencyContact should belong to an House
    // A EmergencyContact can't be created without an House due to the foreign key constraint
    EmergencyContact.belongsTo(models.House, {
        foreignKey: {
        allowNull: false
        }
    });
    };
    return EmergencyContact;
};
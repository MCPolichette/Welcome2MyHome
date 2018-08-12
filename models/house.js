module.exports = function(sequelize, DataTypes) {
  var House = sequelize.define("House", {
    host_name: DataTypes.TEXT,
    place_name: DataTypes.TEXT,
    place_photo: DataTypes.TEXT,
    host_address: DataTypes.TEXT,
    host_phone: DataTypes.TEXT,
    host_email: DataTypes.TEXT,
    wifi_network: DataTypes.TEXT,
    wifi_password: DataTypes.TEXT,
    house_alarm_pw: DataTypes.TEXT,
    house_info: DataTypes.TEXT,
    //  createdAt/ and updatedAt happen automatically
  },
  {
    freezeTableName: true
  });

  House.associate = function (models) {
    // Associating House with EmergencyContact
    // When an House is deleted, also delete any associated EmergencyContact
    House.hasMany(models.EmergencyContact, {
      onDelete: "cascade"
    });
  };
  return House;
};
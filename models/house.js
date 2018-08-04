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
    house_alarm_password: DataTypes.TEXT
  });
  return House;
};

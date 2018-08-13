module.exports = function(sequelize, DataTypes) {
  var House = sequelize.define(
    "House",
    {
      host_name: DataTypes.TEXT,
      place_name: DataTypes.TEXT,
      place_photo: DataTypes.TEXT,
      place_city: DataTypes.TEXT,
      place_state: DataTypes.TEXT,
      place_zip: DataTypes.TEXT,
      house_directions: DataTypes.TEXT,
      host_address: DataTypes.TEXT,
      host_phone: DataTypes.TEXT,
      host_email: DataTypes.TEXT,
      host_notes: DataTypes.TEXT,
      wifi_network: DataTypes.TEXT,
      wifi_password: DataTypes.TEXT,
      house_alarm_pw: DataTypes.TEXT,
      house_info: DataTypes.TEXT,
      departure_date: DataTypes.TEXT,
      return_date: DataTypes.TEXT,
      trip_destination: DataTypes.TEXT,
      trip_phone: DataTypes.TEXT,
      trip_address: DataTypes.TEXT,
      trip_state: DataTypes.TEXT,
      trip_country: DataTypes.TEXT,
      trip_notes: DataTypes.TEXT,
      tv_directions: DataTypes.TEXT,
      house_maintenance: DataTypes.TEXT,
      house_rules: DataTypes.TEXT
      //  createdAt/ and updatedAt happen automatically
    },
    {
      freezeTableName: true
    }
  );

  House.associate = function(models) {
    // Associating House with EmergencyContact
    // When an House is deleted, also delete any associated EmergencyContact
    House.hasMany(models.EmergencyContact, {
      onDelete: "cascade"
    });
  };
  return House;
};

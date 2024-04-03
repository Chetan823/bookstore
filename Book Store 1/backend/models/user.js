const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'regular'),
      defaultValue: 'regular',
    },
  });

  // Instance method to hash password before saving user
  // User.prototype.hashPassword = async function () {
  //   if (this.changed('password')) {
  //     const saltRounds = 10; // Adjust salt rounds as needed
  //     try {
  //       this.password = await bcrypt.hash(this.password, saltRounds);
  //     } catch (error) {
  //       console.error('Error hashing password:', error);
  //       throw error; // Re-throw the error to stop user creation
  //     }
  //   }
  // };

  // // Instance method to compare provided password with hashed password
  // User.prototype.comparePassword = async function (providedPassword) {
  //   return await bcrypt.compare(providedPassword, this.password);
  // };

  // // **Crucial Change:** Call `hashPassword` before saving a new user
  // User.beforeSave(async (user, options) => {
  //   await user.hashPassword();
  // });

  return User;
};

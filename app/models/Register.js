module.exports = (sequelize, DataTypes) => {
    
    const Register = sequelize.define('Register', {
        name: DataTypes.STRING,
        number: DataTypes.STRING,
        schedule: DataTypes.STRING,
        createDate: DataTypes.STRING,
    });

    return Register;
}
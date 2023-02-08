
const {Sequelize,DataTypes} = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
console.log("env",process.env.NODE_ENV)


let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

const users = require("./users")
const contents = require("./contents")

let User = users(sequelize);
let Content = contents(sequelize);

User.hasMany(Content, {
  foreignKey: 'user_id'
});
Content.belongsTo(User, {
  foreignKey: 'user_id'
});

;(async () => {
  // 这里是代码
  try {
    console.log("sequelize",sequelize)
    await sequelize.sync();
  
    
    // Object.keys(db).forEach(modelName => {
    //   if (db[modelName].associate) {
    //     db[modelName].associate(db);
    //   }
    // });
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

module.exports = {
  User,
  Content
};

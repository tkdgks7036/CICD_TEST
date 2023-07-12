'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Users 모델에서 [ 1 : N ] 관계 설정
      this.hasMany(models.Posts, { // Users모델 ( 1 ) : Posts모델 ( N )
        sourceKey: 'userId', // Users모델 ( = models/users.js ) 의 userId 를
        foreignKey: 'userId' // Posts모델 ( = models/posts.js ) 의 userId 와 연결
      });
    };
  };

  Users.init({
    userId: {
      allowNull: false, // NOT NULL
      autoIncrement: true, // AUTO-INCREMENT
      primaryKey: true, // PK
      type: Sequelize.INTEGER
    },
    nickname: {
      allowNull: false, // NOT NULL
      type: Sequelize.STRING
    },
    password: {
      allowNull: false, // NOT NULL
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false, // NOT NULL
      defaultValue: sequelize.NOW, // NULL 이여도 설정된 기본값으로 자동 삽입
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false, // NOT NULL
      defaultValue: sequelize.NOW, // NULL 이여도 설정된 기본값으로 자동 삽입
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};
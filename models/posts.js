'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');
// const { FOREIGNKEYS } = require('sequelize/types/query-types');

module.exports = (sequelize, DataTypes) => {
  class Posts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      // Posts 모델에서 [ 1 : 1 ] 관계 설정
      this.belongsTo(models.Users, { // Posts모델 ( 1 ) : Users모델 ( 1 )
        targetKey: 'userId', // Users모델 ( = models/users.js ) 의 userId 를
        foreignKey: 'userId' // Posts모델 ( = models/posts.js ) 의 userId 와 연결

        // Todo : 이해하고 넘어가자
        // 처음에는 왜 targetKey 가 Users 모델에서 가져온 것인지 이해하기 어려웠다.
        // 다시 한 번 생각해보면 foreignKey 는 외부에서 가져온 key 라는 의미이다.
        // Posts모델이 가지고 있는 userId 는 이미 fk 로써 ( foreignKey )
        // 어떤 모델에서 값을 가져올지 타겟팅한다고 생각을 접근하면 좋을 것 같다 ( targetKey )
      });
    };
  };

  Posts.init({
    postId: {
      allowNull: false, // NOT NULL
      autoIncrement: true, // AUTO-INCREMENT
      primaryKey: true, // PK
      type: Sequelize.INTEGER
    },
    userId: {
      allowNull: false, // NOT NULL
      type: Sequelize.INTEGER,
      references: {
        model: 'Users',
        key: 'userId'
      }
    },
    nickname: {
      allowNull: false, // NOT NULL
      type: Sequelize.STRING
    },
    title: {
      allowNull: false, // NOT NULL
      type: Sequelize.STRING
    },
    content: {
      allowNull: false, // NOT NULL
      type: Sequelize.STRING
    },
    createdAt: {
      allowNull: false, // NOT NULL
      defaultValue: Sequelize.NOW, // NULL 이여도 설정된 기본값으로 자동 삽입
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false, // NOT NULL
      defaultValue: Sequelize.NOW, // NULL 이여도 설정된 기본값으로 자동 삽입
      type: Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'Posts',
  });
  return Posts;
};
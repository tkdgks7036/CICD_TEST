'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Posts', {
            postId: {
                allowNull: false, // NOT NULL
                autoIncrement: true, // AUTO-INCREMENT
                primaryKey: true, // PK
                type: Sequelize.INTEGER
            },
            userId: {
                allowNull: false, // NOT NULL
                type: Sequelize.INTEGER,
                references: { // Users 모델에 있는 userId 를 참조한다.
                    model: 'Users',
                    key: 'userId'
                }
            },
            nickname: {
                allowNull: false, // NOT NULL
                type: Sequelize.STRING,
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
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Posts');
    }
};
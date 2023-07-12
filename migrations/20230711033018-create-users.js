'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            userId: {
                allowNull: false, // NOT NULL
                autoIncrement: true, // AUTO-INCREMENT
                primaryKey: true, // PK
                type: Sequelize.INTEGER
            },
            nickname: {
                allowNull: false, // NOT NULL
                unique: true,
                type: Sequelize.STRING
            },
            password: {
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
        await queryInterface.dropTable('Users');
    }
};
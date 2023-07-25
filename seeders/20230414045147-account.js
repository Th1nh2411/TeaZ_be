'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Accounts', [
            {
                phone: '0868466696',
                password: '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
                forgot: 0,
                role: 0,
                //user
            },
            {
                phone: '0868466697',
                password: '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
                forgot: 0,
                role: 1,
                //nhanvien
            },
            {
                phone: '0868466699',
                password: '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
                forgot: 0,
                role: 2,
                //admin
            },
            {
                phone: '0868466700',
                password: '$2a$10$pVN6f.l9WXqsQxifG89kTOewLKmN6BxXjFoqIUra5MIBcc6Z8yhtW',
                forgot: 0,
                role: 0,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {},
};

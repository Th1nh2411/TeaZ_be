'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert('Ingredients', [
            {
                name: 'Black Tea',
                unitName: 'g',
                image: 'https://www.freshpoint.com/wp-content/uploads/2020/02/Freshpoint-green-cabbage.jpg',
                isActive: 1,
                quantity: 0,
            },
            {
                name: 'Green Tea',
                unitName: 'g',
                image: 'https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQKTQ8_nIRsYQnbuY1lkCshW7rszXXuhm7VCJKVoVfKNgXuEC7nTbMRNsmi07fvDRa6i94qp8mi-bWzubEetQ&s=19',
                isActive: 1,
                quantity: 0,
            },
            {
                name: 'Milk',
                unitName: 'g',
                image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b25pb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                isActive: 1,
                quantity: 0,
            },
            {
                name: 'Bubble',
                unitName: 'g',
                image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b25pb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                isActive: 1,
                quantity: 0,
            },
            {
                name: 'Black Sugar',
                unitName: 'g',
                image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b25pb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                isActive: 1,
                quantity: 0,
            },
            {
                name: 'Brown Sugar',
                unitName: 'g',
                image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b25pb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                isActive: 1,
                quantity: 0,
            },
            {
                name: 'Sugar',
                unitName: 'g',
                image: 'https://images.unsplash.com/photo-1585849834908-3481231155e8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8b25pb258ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
                isActive: 1,
                quantity: 0,
            },
        ]);
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
    },
};

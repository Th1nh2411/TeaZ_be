const { Shop } = require('../models');
const geolib = require('geolib');

const getNearestDistances = (currentLocation, coordinate, count = 2) => {
    //console.log(coordinates)
    // const distances = coordinates.map((detailShop) => {
    //     const distance = geolib.getDistance(currentLocation, detailShop);
    //     return { detailShop, distance };
    // });
    const distances = coordinate.map((detailShop) => {
        const distance = geolib.getDistance(currentLocation, detailShop);
        return { detailShop, distance };
    });
    distances.sort((a, b) => a.distance - b.distance);

    return distances.slice(0, count);
};
const getListShopWithCoord = async () => {
    const shop = await Shop.findOne({});
    // const coordinateList = listShop.map((shop) => ({
    //     address: shop.address,
    //     image: shop.image,
    //     latitude: parseFloat(shop.latitude),
    //     longitude: parseFloat(shop.longitude),
    // }));

    return shop;
};
const getShopInfo = async (req, res) => {
    try {
        const currentLocation = {
            latitude: parseFloat(req.query.latitude),
            longitude: parseFloat(req.query.longitude),
        };
        // const listStoreNearest = getNearestDistances(currentLocation, listShop, 2);
        const shop = await Shop.findOne({
            attributes: ['address', 'image', 'isActive', 'latitude', 'longitude'],
            raw: true,
        });
        console.log(currentLocation, shop);
        const distance = geolib.getDistance(currentLocation, { latitude: shop.latitude, longitude: shop.longitude });
        //console.log(listShop)
        if (!shop) {
            return res.status(500).json({ error: 'Không tìm thấy cửa hàng' });
        }
        //const nearestDistances = getNearestDistances(currentLocation, coordinateList);

        return res.status(200).json({
            isSuccess: true,
            shop,
            distance,
        });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

module.exports = {
    // getDetailTaiKhoan,
    getShopInfo,
};

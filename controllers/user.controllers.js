const { Shop } = require("../models");
const geolib = require('geolib');

const getNearestDistances= (currentLocation, coordinates, count = 2)=> {
    //console.log(coordinates)
    const distances = coordinates.map(detailShop => {
      const distance = geolib.getDistance(currentLocation, detailShop);
      return { detailShop, distance };
    });
  
    distances.sort((a, b) => a.distance - b.distance);
  
    return distances.slice(0, count);
  }
const getListShopWithCoord = async ()=>{
    const listShop = await Shop.findAll({
       where:{isActive:1}
    })
    const coordinateList = listShop.map(shop => ({
        idShop: shop.idShop,
        address: shop.address,
        image: shop.image,
        latitude: parseFloat(shop.latitude),
        longitude: parseFloat(shop.longitude),
      }));
    
    return coordinateList;
}
const listStoreNearest = async (req, res) => {
    try {

        const currentLocation = {
            latitude:  parseFloat(req.query.latitude),
            longitude: parseFloat(req.query.longitude),
            
        };
        const listShop = await getListShopWithCoord();
        const listStoreNearest = getNearestDistances(currentLocation, listShop, 2)
        //console.log(listShop)
        if(!listShop){
            return res.status(500).json({ error: 'Không tìm thấy cửa hàng' });
        }
        //const nearestDistances = getNearestDistances(currentLocation, coordinateList);
        
        return res
        .status(200)
        .json({
           isSuccess: true,  listStoreNearest
        });
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};



module.exports = {
    // getDetailTaiKhoan,
    listStoreNearest,
};
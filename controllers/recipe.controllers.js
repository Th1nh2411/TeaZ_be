const { Shop,Recipe_shop, Recipe } = require("../models");
const { QueryTypes, Op, where } = require("sequelize");



const menuByTypeForUser = async (req, res) => {
    try {
        if(req.query.idShop==''){
            return res.status(400).json({isSuccess: true});
        }
        const idShop = parseInt(req.query.idShop);
        let listType=[]
        let menu
        if(req.query.idType!==''){
            listType = req.query.idType.split(',').map(Number);
            menu = await Recipe_shop.findAll({
                where:{
                    idShop:idShop,
                    isActive:1,
                },
                attributes: ['discount'],
                include:[{
                    model: Recipe,
                    where: {idType:{ [Op.in]:listType }}, 
                }
                ]
            })
        }
        else{
            menu = await Recipe_shop.findAll({
                where:{
                    idShop:idShop,
                    isActive:1,
                },
                attributes: ['discount'],
                include:[{
                    model: Recipe,
                    
                }
                ]
            })
        }
        
        
        
        

        return res.status(200).json({isSuccess: true, menu});
    } catch (error) {
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
};

const searchRecipe = async (req, res) => {


    try {
      const name = req.query.name
      const idShop = req.query.idShop
  
      const recipes = await Recipe.findAll({
        where: {
          name: { [Op.like]: `%${name}%` }
        },
        attributes: ['idRecipe', 'name', 'image', 'type'],
        //offset: limit_page[0],
        limit: 5,
        raw: true,
        include: [
          {
            model: Recipe_shop,
            where: { idShop: idShop, isActive: 1 },
            required: true,
            attributes: ['discount']
          },
        ]
      });
      recipes = recipes.map( item  => {

        return {
            idRecipe: item['idRecipe'],
            name: item['name'],
            image: item['image'],
            type: item['type'],
            discount: item['Recipe_shops.discount'],
        }
      })
    
  
  
      res
        .status(200)
        .json({
          recipes,
          isSuccess: true
        });
    } catch (error) {
      res.status(500).json({ isSuccess: false });
    }
  };

module.exports = {
    // getDetailTaiKhoan,
    menuByTypeForUser, searchRecipe
};
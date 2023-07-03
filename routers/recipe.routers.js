const express = require("express");

const {menuByTypeForUser} = require("../controllers/recipe.controllers");

const recipeRouter = express.Router();



module.exports = {
    recipeRouter,
}
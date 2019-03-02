import axios from "axios";
import { key } from "../config";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.author = res.data.recipe.publisher;
      this.image = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;
    } catch (error) {
      console.log(`Error: ${error}`);
      alert("Something went wrong :(");
    }
  }
  calcTime() {
    // Add 15 min for each 3 ingredients to estimate time
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings() {
    this.servings = 4;
  }

  parseIngredients() {
    const unitsLong = [
      "tablespoons",
      "tablespoon",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitsShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];
    const newIngredients = this.ingredients.map(e => {
      // Uniform units
      let ingredient = e.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitsShort[i]);
      });
      // Remove parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");
      // Parese ingredients into count, unit and ingredients
      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

      let objIng;

      if (unitIndex > -1) {
        //There is a unit
        const arrCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.splice(unitIndex + 1).join(" ")
        };
      } else if (Number(arrIng[0])) {
        // There is no unit but it's a number;
        objIng = {
          count: Number(arrIng[0]),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        //There is NO unit and no Number in first position
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }
      return objIng;
    });
    this.ingredients = newIngredients;
    window.xx = this;
  }
}

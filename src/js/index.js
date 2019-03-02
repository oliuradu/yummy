// Global app controller

// Imports
import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";
/** Global state of the app
 * -Search object
 * -Curent recipe object
 * -Shopping list object
 * -Liked recipes
 */

const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  //1 Get input value (query)
  const query = searchView.getInput(); // TODO

  if (query) {
    //2 Create a new search object and add it to state
    state.search = new Search(query);

    //3 Prepare the UI for results
    searchView.clearInput();
    renderLoader(elements.searchRes);
    searchView.clearResults();

    try {
      //4 Search for recipes
      await state.search.getResults();

      // 5 Render result on UI
      clearLoader();
      searchView.renderResults(state.search.result);
    } catch (err) {
      console.log(err);
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

elements.searchResPages.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");

  if (btn) {
    const goTopage = Number(btn.dataset.goto);
    searchView.clearResults();
    searchView.renderResults(state.search.result, goTopage);
  }
});

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // Get id form url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for changes
    renderLoader("recipe");
    // Create new recipe object
    state.recipe = new Recipe(id);
    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();
      // Call the methods from recipe ( servings and time)
      state.recipe.calcTime();
      state.recipe.calcServings();
      // Render recipe
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      console.log(err);
    }
  }
};

["load", "hashchange"].forEach(e => window.addEventListener(e, controlRecipe));

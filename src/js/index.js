// Global app controller

// Imports
import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderLoader, clearLoader } from "./views/base";
import Recipe from "./models/Recipe";
import List from "./models/List";
import Likes from "./models/Likes";
/** Global state of the app
 * -Search object
 * -Curent recipe object
 * -Shopping list object
 * -Liked recipes
 */

const state = {};
// TESTING
window.state = state;

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
 * Like CONTROLLER
 */
// TESTING
state.likes = new Likes();

const controlLike = () => {
  if (!state.likes) state.likes = new Likes();
  const currentID = state.recipe.id;
  if (!state.likes.isLiked(currentID)) {
    // Not likes yet
    const newLike = state.likes.addLike(
      currentID,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //Add like to the state

    // Toggle the like button
    likesView.toggleLikeBtn(true);

    likesView.renderLike(newLike);

    // Add like to the UI
  } else {
    state.likes.deleteLike(currentID);
    // User HAS liked
    //Remove like to the state
    // Toggle the like button
    likesView.toggleLikeBtn(false);
    // Remove like to the UI
    likesView.deleteLike(currentID);
  }

  likesView.toggleLikeMenu(state.likes.getNumLikes());
};

/**
 * List CONTROLLER
 */
const controlList = () => {
  // Create a new lsit if there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list

  state.recipe.ingredients.forEach(e => {
    const item = state.list.addItem(e.count, e.unit, e.ingredient);
    listView.renderItem(item);
  });
};

/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
  // Get id form url
  const id = window.location.hash.replace("#", "");

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();

    // Hightlight result
    if (state.search) searchView.highlightSelected(id);
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
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (err) {
      console.log(err);
    }
  }
};

["load", "hashchange"].forEach(e => window.addEventListener(e, controlRecipe));

// Handle delete and update list item events
elements.shopping.addEventListener("click", e => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle the delete

  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  } else if (e.target.matches(".shopping__count--value")) {
    const val = Number(e.target.value);
    state.list.updateCount(id, val);
  }
});

// Handle recipes button clicks

elements.recipe.addEventListener("click", e => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrase button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings();
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add , .recipe__btn--add * ")) {
    // Add ingredients to shopping list
    controlList();
  } else if (e.target.matches(".recipe__love, .recipe__love *")) {
    controlLike();
  }
});

likesView.toggleLikeMenu(state.likes.getNumLikes());

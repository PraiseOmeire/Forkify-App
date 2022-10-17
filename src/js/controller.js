import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';

// import icons from '../img/icons.svg'; //parcel 1
//parcel 2
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';

if (module.hot) {
  module.hot.accept();
}

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    // loading recipe
    await model.loadRecipe(id);
    const { recipe } = model.state;

    //rendering the reipe
    recipeView.render(model.state.recipe);

    //servings control
    controlServings();
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1. get search query
    const query = searchView.getQuery();
    if (!query) return;

    //2. loaf search results
    await model.loadSearchResults(query);

    //3. render resullt

    // resultsView.render(model.state.search.results);
    resultsView.render(model.getSearchResultsPage());

    //render initial pagination button
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};
// controlSearchResults();

const controlPagination = function (goToPage) {
  //1. render new resullt
  resultsView.render(model.getSearchResultsPage(goToPage));

  //render new pagination button
  paginationView.render(model.state.search);
};

const controlServings = function () {
  // update the recipe serving (in state)
  model.updateServing(6);
  //Update the recipe view
  recipeView.render(model.state.recipe);
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};
init();

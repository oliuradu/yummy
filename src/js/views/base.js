export const elements = {
  searchForm: document.querySelector(".search"),
  searchInput: document.querySelector(".search__field"),
  searchRes: document.querySelector(".results"),
  searchResultList: document.querySelector(".results__list"),
  searchResPages: document.querySelector(".results__pages"),
  recipe: document.querySelector(".recipe")
};

export const elementStrings = {
  loader: "loader"
};

export const renderLoader = parent => {
  if (parent === "recipe") {
    let loader = `
        <figure id="preloader_fig" class="recipe__fig ${elementStrings.loader}">
            <div id="preloader_img" class="recipe__img"/></div>
            <h1 class="recipe__title">
              <span><span id="preloader_title"></span></span>
            </h1>
        </figure>`;
    document.querySelector(".recipe").innerHTML = loader;
  } else {
    let loader = `<div class="${elementStrings.loader} preloader">`;

    for (let i = 0; i < 10; i++) {
      loader += `
            <div class="wrapper-cell">
              <div class="image"></div>
                <div class="text">
                  <div class="text-line"> </div>
                  <div class="text-line"></div>
                </div>
            </div>`;
    }
    loader += `</div>`;
    parent.insertAdjacentHTML("afterbegin", loader);
  }
};

export const clearLoader = parent => {
  const loader = document.querySelector(`.${elementStrings.loader}`);

  if (loader) {
    loader.parentElement.removeChild(loader);
  }
};

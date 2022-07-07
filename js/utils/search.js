const filters = [
  {
    'name': '',
    'type': 'search'
  }
]

class Filter {
  constructor(name, type){
    this.name = name;
    this.type = type;
  }
}

function searchInput(recipes) {
  const searchInput = document.querySelector('div.search input.search-input');

  searchInput.addEventListener('input', (e) => {
    if (e.target.value.length > 2) {
      const value = e.target.value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      filters.splice(filters.findIndex((e) => e.type === 'search'), 1, {'name': value, 'type': 'search'})
    } else {
      filters.splice(filters.findIndex((e) => e.type === 'search'), 1, {'name': '', 'type': 'search'})
    }
    filterRecipes(recipes)
  })
}

function filterRecipes(recipes) {
  const containerUl = document.querySelector('ul.results-list');
  containerUl.parentElement.querySelector('div').innerHTML = '';
  containerUl.innerHTML = '';

  filterEngine(filters)

  function filterEngine(filters, ignoredParameter) {
    for (let i = 0; i < recipes.length; i++) {
      const normalizedRecipe = recipeNormalizer(recipes[i]);
      let sortRecipe = false;
  
      let filtersValidation = [];

      for (j = 0; j < filters.length; j++) {
        let isFilterTrue = false;

        if (filters[j].type === 'search') {
          if (normalizedRecipe.name.includes(filters[j].name)) {
            sortRecipe = true;
            isFilterTrue = true;
          } else if (normalizedRecipe.description.includes(filters[j].name)) {
            isFilterTrue = true;
          }
        }
        if (filters[j].type === 'ingredient') {
          let ignoreNextIngredients = false;
  
          let isIngredientTrue = false;
  
          for (let k = 0; k < normalizedRecipe.ingredients.length; k++) {
            if (normalizedRecipe.ingredients[k].ingredient.includes(filters[j].name) && !ignoreNextIngredients) {
              ignoreNextIngredients = true;
  
              isIngredientTrue = true
            }
          }
  
          if (isIngredientTrue) {
            isFilterTrue = true;
          }
        }
        if (filters[j].type === 'appliance') {
          if (normalizedRecipe[`${filters[j].type}`].includes(filters[j].name)) {
            isFilterTrue = true;
          }
        }
        if (filters[j].type === 'ustensil') {
          let ignoreNextIngredients = false;
          let isUstensilTrue = false;
  
          for (let k = 0; k < normalizedRecipe.ustensils.length; k++) {
            if (normalizedRecipe.ustensils[k].includes(filters[j].name) && !ignoreNextIngredients) {
              ignoreNextIngredients = true;
  
              isUstensilTrue = true
            }
          }
  
          if (isUstensilTrue) {
            isFilterTrue = true;
          }
        }

        if (isFilterTrue) {
          filtersValidation.push(true)
        } else {
          filtersValidation.push(false)
        }
      }

      let result = true;
      for (let j = 0; j < filtersValidation.length; j++) {
        if (filtersValidation[j] == false) {
            result = false;
            break;
        }
      }

      if (result) {
        generateRecipe(recipes[i], containerUl, ignoredParameter, sortRecipe);
      }
    }
  }

  if (containerUl.innerHTML === '') {
    containerUl.parentElement.querySelector('div').innerHTML = '<p>Aucune recette ne correspond à vos critères… </br></br>Vous pouvez chercher « tarte aux pommes », « poisson », etc...</p><p>Ces autres recettes peuvent cependant vous intéresser :</p>';
    containerUl.innerHTML = '';
    const alternateFilters = JSON.parse(JSON.stringify(filters));
    alternateFilters.splice(alternateFilters.findIndex((e) => e.type === 'search'), 1)
    filterEngine(alternateFilters, filters.find((e) => e.type === 'search').name)
  }
}
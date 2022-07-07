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
    recipes.forEach((recipe) => {
      const normalizedRecipe = recipeNormalizer(recipe);
      let sortRecipe = false;
  
      if (filters.every((item) => {
        if (item.type === 'search') {
          if (normalizedRecipe.name.includes(item.name)) {
            sortRecipe = true;
            return true
          } else if (normalizedRecipe.description.includes(item.name)) {
            return true
          }
        }
        if (item.type === 'ingredient') {
          let ignoreNextIngredients = false;
  
          let isIngredientTrue = false;
  
          normalizedRecipe.ingredients.forEach((ingredient) => {
            if (ingredient.ingredient.includes(item.name) && !ignoreNextIngredients) {
              ignoreNextIngredients = true;
  
              isIngredientTrue = true
            }
          })
  
          if (isIngredientTrue) {
            return true
          }
        }
        if (item.type === 'appliance') {
          if (normalizedRecipe[`${item.type}`].includes(item.name)) {
            return true
          }
        }
        if (item.type === 'ustensil') {
          let ignoreNextIngredients = false;
          let isUstensilTrue = false;
  
          normalizedRecipe.ustensils.forEach((ustensil) => {
            if (ustensil.includes(item.name) && !ignoreNextIngredients) {
              ignoreNextIngredients = true;
  
              isUstensilTrue = true
            }
          })
  
          if (isUstensilTrue) {
            return true
          }
        }
      })) {
        generateRecipe(recipe, containerUl, ignoredParameter, sortRecipe);
      }
    });
  }

  if (containerUl.innerHTML === '') {
    containerUl.parentElement.querySelector('div').innerHTML = '<p>Aucune recette ne correspond à vos critères… </br></br>Vous pouvez chercher « tarte aux pommes », « poisson », etc...</p><p>Ces autres recettes peuvent cependant vous intéresser :</p>';
    containerUl.innerHTML = '';
    const alternateFilters = JSON.parse(JSON.stringify(filters));
    alternateFilters.splice(alternateFilters.findIndex((e) => e.type === 'search'), 1)
    filterEngine(alternateFilters, filters.find((e) => e.type === 'search').name)
  }
}

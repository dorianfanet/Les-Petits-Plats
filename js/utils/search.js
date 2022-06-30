// results list
// create recipes cards using factory
function recipeNormalizer(recipe){
  const lowered = JSON.parse(JSON.stringify(recipe, function(a, b) {return typeof b === "string" ? b.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "") : b}))
  return lowered;
}

function searchRecipes(recipes) {
  // DOM elements
  const searchInput = document.querySelector('div.search input.search-input');

  // create container ul
  const containerUl = document.querySelector('ul.results-list');

  function generateRecipes(data){
    data.forEach((recipe) => {
      generateRecipe(recipe)
    })
  }

  function generateRecipe(recipe){
    const recipeCard = recipesFactory(recipe).DOM();
    containerUl.appendChild(recipeCard)
  }

  generateRecipes(recipes)

  searchInput.addEventListener('input', (e) => {
    containerUl.innerHTML = '';
    const value = e.target.value.toLowerCase();

    let filteredRecipes = JSON.parse(JSON.stringify(recipes));

    if (value.length > 2) {

      // check titles
      for (let recipeIndex = 0; recipeIndex < recipes.length; recipeIndex++) {
        const normalizedRecipe = recipeNormalizer(recipes[recipeIndex]);
        if (normalizedRecipe.name.includes(value)) {
          generateRecipe(recipes[recipeIndex])
          filteredRecipes = filteredRecipes.filter(filteredRecipe => filteredRecipe.name !== recipes[recipeIndex].name)
        }
      }

      console.log(filteredRecipes)

      let tempFiltered = filteredRecipes;
      // check ingredients
      for (let recipeIndex = 0; recipeIndex < tempFiltered.length; recipeIndex++) {
        const normalizedRecipe = recipeNormalizer(tempFiltered[recipeIndex]);
        
        let ignoreNextIngredients = false;

        normalizedRecipe.ingredients.forEach((ingredient) => {
          if (ingredient.ingredient.includes(value) && !ignoreNextIngredients) {
            generateRecipe(tempFiltered[recipeIndex])
            filteredRecipes = filteredRecipes.filter(filteredRecipe => filteredRecipe.name !== tempFiltered[recipeIndex].name)
            
            ignoreNextIngredients = true;
          }
        })
      }

      console.log(filteredRecipes)

      tempFiltered = filteredRecipes;
      // check description
      for (let recipeIndex = 0; recipeIndex < tempFiltered.length; recipeIndex++) {
        const normalizedRecipe = recipeNormalizer(tempFiltered[recipeIndex]);
        if (normalizedRecipe.description.includes(value)) {
          generateRecipe(tempFiltered[recipeIndex])
          filteredRecipes = filteredRecipes.filter(filteredRecipe => filteredRecipe.description !== recipes[recipeIndex].description)
        }
      }

    } else {
      generateRecipes(recipes)
    }
  })
}
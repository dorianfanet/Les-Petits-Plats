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
      // let spliceCount = 0;

      // check titles
      recipes.filter((recipe) => {
        const normalizedRecipe = recipeNormalizer(recipe);
        if (normalizedRecipe.name.includes(value)) {
          generateRecipe(recipe)
          filteredRecipes = filteredRecipes.filter(filteredRecipe => filteredRecipe.name !== recipe.name)
        }
      })

      // check ingredients
      filteredRecipes.filter((recipe) => {
        const normalizedRecipe = recipeNormalizer(recipe);

        let ignoreNextIngredients = false;

        normalizedRecipe.ingredients.forEach((ingredient) => {
          if (ingredient.ingredient.includes(value) && !ignoreNextIngredients) {
            generateRecipe(recipe)
            filteredRecipes = filteredRecipes.filter(filteredRecipe => filteredRecipe.description !== recipe.description)

            ignoreNextIngredients = true;
          }
        })
      })

      // check descriptions
      filteredRecipes.filter((recipe) => {
        const normalizedRecipe = recipeNormalizer(recipe);
        if (normalizedRecipe.description.includes(value)) {
          generateRecipe(recipe)
          filteredRecipes = filteredRecipes.filter(filteredRecipe => filteredRecipe.description !== recipe.description)
        }
      })

    } else {
      generateRecipes(recipes)
    }
  })
}
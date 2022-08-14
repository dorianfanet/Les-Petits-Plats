function generateRecipes(data, ignoredParameter, sortRecipe){
  const containerUl = document.querySelector('ul.results-list');
  data.forEach((recipe) => {
    generateRecipe(recipe, containerUl, ignoredParameter, sortRecipe)
  })
}

function generateRecipe(recipe, container, ignoredParameter, sortRecipe){
  const recipeCard = recipesFactory(recipe, ignoredParameter, sortRecipe).DOM();
  container.appendChild(recipeCard)
}
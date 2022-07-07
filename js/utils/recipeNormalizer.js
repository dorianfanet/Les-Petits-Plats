// create recipes cards using factory
function recipeNormalizer(recipe){
  const lowered = JSON.parse(JSON.stringify(recipe, function(a, b) {return typeof b === "string" ? b.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "") : b}))
  return lowered;
}
// fetch data from .json
async function getData() {
  // fetch data
  const response = await fetch('./data/recipes.json');
  const recipes = await response.json();

  // return data
  return recipes;
}

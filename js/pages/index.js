const header = document.querySelector('header');
const results = document.querySelector('.results');

window.addEventListener('scroll', () => {
  if(window.scrollY > 20){
    shrinkHeader()
  } else {
    expandHeader()
  }
})

function shrinkHeader(){
  header.classList.add('shrink');
  results.classList.add('shrink');
}

function expandHeader(){
  header.classList.remove('shrink');
  results.classList.remove('shrink');
}

// DOM elements
const sortBtnContainer = document.querySelectorAll('.sort-btn');
const sortBtn = document.querySelectorAll('.sort-btn button');
const sortList = document.querySelectorAll('.sort-btn .list ul');
const sortInput = document.querySelectorAll('.sort-btn button input');

for(let i = 0; i < sortBtnContainer.length; i++) {
  sortBtnContainer[i].addEventListener('click', () => {
    if(sortBtnContainer[i].classList.contains('active')){
      hideFilter(i);
    } else {
      hideFilter(i);
      displayFilter(i);
    }
  });
}

document.addEventListener('click', hideFilter);
sortBtnContainer.forEach((e) => e.addEventListener('click', (e) => {
  e.stopPropagation();
  return false;
}));

function hideFilter(index){
  sortBtnContainer.forEach((e) => e.classList.remove('active'))
  document.body.style.overflow = 'unset'
}
function displayFilter(index){
  sortBtnContainer[index].classList.add('active');
  sortInput[index].focus();
  document.body.style.overflow = 'hidden'
}

header.addEventListener('mouseenter', () => {
  expandHeader();
})

const applianceUl = document.querySelector('.list #appliance');
const ingredientUl = document.querySelector('.list #ingredient');
const ustensilUl = document.querySelector('.list #ustensil');

function createFilters(data) {

  const ustensilList = new Set(data.map((recipe) => {
    const ustList = recipe.ustensils
    return ustList
  }).flat())
  addLiToDom(ustensilList, ustensilUl)

  const ingredientList = new Set(data.map((recipe) => {
    const ingList = recipe.ingredients
    const newList = ingList.map(obj => obj.ingredient)
    return newList
  }).flat())
  addLiToDom(ingredientList, ingredientUl)

  const applianceList = new Set(data.map(recipe => recipe.appliance))
  addLiToDom(applianceList, applianceUl)

  function addLiToDom(list, container){
    list.forEach((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      container.appendChild(li)
    })
  }

  const ingredientElements = document.querySelectorAll('.list #ingredient li');
  const applianceElements = document.querySelectorAll('.list #appliance li');
  const ustensilElements = document.querySelectorAll('.list #ustensil li');

  const filterTypesList = [ingredientElements, applianceElements, ustensilElements]

  const filterInput = document.querySelectorAll('.sort-btn input');
  for (let i = 0; i < filterInput.length; i++){
    filterInput[i].addEventListener('input', () => {
      filterTypesList[i].forEach(e => {
        if (!e.textContent.toLowerCase().includes(filterInput[i].value.toLowerCase())) {
          e.style.display = 'none'
        } else if (e.textContent.toLowerCase().includes(filterInput[i].value.toLowerCase())) {
          e.style.display = 'block'
        }
      })
    })
  }
}

function filterActivation(recipes) {
  // filter activation
  const filterList = document.querySelectorAll('.sort-btn .list li');
  const activeFiltersContainer = document.querySelector('.active-filter ul');

  filterList.forEach(filter => filter.addEventListener('click', () => {

    const filterLi = document.createElement('li');
    filterLi.classList.add(filter.parentElement.id)
    filterLi.innerHTML = `${filter.textContent}<i class="far fa-times-circle"></i>`

    filters.push(new Filter(`${JSON.parse(JSON.stringify(filter.textContent, function(a, b) {return typeof b === "string" ? b.normalize('NFD').toLowerCase().replace(/[\u0300-\u036f]/g, "") : b}))}`, `${filter.parentElement.id}`))

    filterRecipes(recipes);

    activeFiltersContainer.appendChild(filterLi);
    header.classList.add('filtered');
    results.classList.add('filtered');

  }));

  activeFiltersContainer.addEventListener('click', function(e){
    if (e.target && e.target.nodeName == 'LI'){
      e.target.remove()
      removeFilter(e.target.textContent)
    } else if (e.target && e.target.nodeName == 'I') {
      e.target.parentElement.remove();
      removeFilter(e.target.parentElement.textContent)
    }

    function removeFilter(element) {
      filters.splice(filters.findIndex((e) => e.name === element), 1)
    }

    filterRecipes(recipes);

    if (document.querySelectorAll('.active-filter ul li').length === 0) {
      header.classList.remove('filtered')
      results.classList.remove('filtered')
    }
  })
}

async function init() {
  const { recipes } = await getData();

  console.log(recipes)

  const loweredRecipes = JSON.parse(JSON.stringify(recipes, function(a, b) {
    return typeof b === "string" ? b.toLowerCase() : b
  }));

  generateRecipes(recipes)

  createFilters(loweredRecipes)

  filterActivation(recipes)

  searchInput(recipes)
}

init()

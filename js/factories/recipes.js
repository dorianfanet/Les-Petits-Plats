function recipesFactory(data) {

  const { name, description, time, ingredients } = data;

  function DOM() {
    const container = document.createElement('li');
    container.classList.add('recipe-card')

    const a = document.createElement('a');

    const figure = document.createElement('figure');

    const img = document.createElement('img');
    img.setAttribute('src', 'assets/images/blank.png');

    const figcaption = document.createElement('figcaption');

    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header');

    const h2 = document.createElement('h2');
    h2.textContent = name;

    const divTime = document.createElement('div');

    const iTime = document.createElement('i');
    iTime.classList.add('fas', 'fa-clock');

    const spanTime = document.createElement('span');
    spanTime.textContent = `${time} min`

    divTime.appendChild(iTime)
    divTime.appendChild(spanTime)

    cardHeader.appendChild(h2)
    cardHeader.appendChild(divTime)

    const desc = document.createElement('div');
    desc.classList.add('description');
    
    const descUl = document.createElement('ul')

    Array.from(ingredients).forEach(ingredient => {
      const li = document.createElement('li')
  
      const title = document.createElement('p');
      title.textContent = ingredient.ingredient;

      let ingUnit = ingredient.unit;
      if (ingredient.unit === 'grammes') {
        ingUnit = 'g';
      }
  
      const quantity = document.createElement('span');
      if (ingredient.quantity && ingredient.unit) {
        quantity.textContent = ` : ${ingredient.quantity} ${ingUnit}`
      } else if (ingredient.quantity) {
        quantity.textContent = ` : ${ingredient.quantity}`
      } else if (ingredient.unit) {
        quantity.textContent = ` : ${ingUnit}`
      } else {
        quantity.textContent = ''
      }
  
      li.appendChild(title)
      li.appendChild(quantity)

      descUl.appendChild(li)
    })

    const descP = document.createElement('p');
    descP.textContent = description;

    desc.appendChild(descUl)
    desc.appendChild(descP)

    figcaption.appendChild(cardHeader)
    figcaption.appendChild(desc)

    container.appendChild(a)
    a.appendChild(figure)
    figure.appendChild(img)
    figure.appendChild(figcaption)

    return container
  }

  return { DOM }
}
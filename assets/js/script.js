let searchButton = null
let searchInput = null
let userList = []
let searchList = []
let searchText = null

let foundUsers = null
let statisticsList = null
let foundUsersNumber = 0

let numberFormat = null

window.addEventListener('load', () => {
  searchButton = document.querySelector('#search-button');
  searchInput = document.querySelector('#search-input');
  foundUsers = document.querySelector('#found-users');
  statisticsList = document.querySelector('#statistics-list');
  foundUsersNumber = document.querySelector('#found-users-number');
  userList = data.results;
  numberFormat = Intl.NumberFormat('pt-BR')

  searchInput.addEventListener('keyup', () => {
    enableDisableSearchButton();
  })

  searchButton.addEventListener('click', () => {
    if (!event.target.hasAttribute('disabled')) {
      search(searchText)
    }
  })

  fetchUsers()

})

//Valida o input
function enableDisableSearchButton() {
  let text = event.target.value

  if (text.trim().length) {
    searchButton.removeAttribute('disabled', '')
    if (event.key.toUpperCase() === "ENTER") {
      searchText = text
      search(searchText);
    }
  } else {
    searchButton.setAttribute('disabled', 'disabled')
    event.target.value = ''
  }
}

function fetchUsers() {
  userList = userList.map(user => {
    const { name, gender, dob, picture } = user
    return { name: `${name.first} ${name.last}`, gender, age: dob.age, picture: picture.thumbnail }
  })

  userList.sort((a, b) => a.name.localeCompare(b.name))
}

function search(text) {
  searchList = []
  searchList = userList.filter(user => user.name.toUpperCase().includes(text.toUpperCase()))

  render()
}

function render() {
  renderUsersFound()
  renderStatistics()
}


function renderUsersFound() {
  let foundUsersHTML = ``

  searchList.forEach(user => {
    const { name, age, picture } = user
    let userHTML = `
      <div class="d-flex">
        <div>
          <img src="${picture}" alt="${name}">
        </div>
        <div>
          <p>${name}, ${age} anos</p>
        </div>
      </div>
    `

    foundUsersHTML += userHTML
  })

  foundUsersNumber.textContent = searchList.length
  foundUsers.innerHTML = foundUsersHTML
}


function renderStatistics() {
  const maleQty = male()
  const femaleQty = female()
  const ageSumQty = ageSum()
  const med = (ageSumQty / searchList.length).toFixed(2)

  let statsHTML = `
    <ul>
      <li>Gênero masculino: <span class="has-text-weight-bold">${maleQty}</span></li>
      <li>Gênero feminino: <span class="has-text-weight-bold">${femaleQty}</span></li>
      <li>Soma das idades: <span class="has-text-weight-bold">${ageSumQty}</span></li>
      <li>Média das idades: <span class="has-text-weight-bold">${formatNumber(med)}</span></li>
    </ul>
  `

  statisticsList.innerHTML = statsHTML
}

function male() {
  const maleUsers = searchList.filter(user => user.gender.toUpperCase() === "MALE")
  return maleUsers.length
}

function female() {
  const femaleUsers = searchList.filter(user => user.gender.toUpperCase() === "FEMALE")
  return femaleUsers.length
}

function ageSum() {
  return searchList.reduce((acc, cur) => {
    return acc + cur.age
  }, 0)
}

function formatNumber(number) {
  return numberFormat.format(number)
}
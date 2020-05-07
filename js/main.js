"use stricr";






//............................................................................
const cartButton = document.querySelector("#cart-button");
const modal = document.querySelector(".modal");
const close = document.querySelector(".close");
const buttonAuth = document.querySelector(".button-auth");
const modalAuth = document.querySelector(".modal-auth");
const closeAuth = document.querySelector(".close-auth");
const logInForm = document.querySelector("#logInForm")
const loginInput = document.querySelector("#login");
const buttonOut = document.querySelector(".button-out");
const userName = document.querySelector(".user-name");
const cardRestaurants = document.querySelector(".cards-restaurants");
const containerPromo = document.querySelector(".container-promo");
const restaurants = document.querySelector(".restaurants");
const menu = document.querySelector(".menu");
const logo = document.querySelector(".logo");
const cardsMenu = document.querySelector(".cards-menu");
const restaurantTitle = document.querySelector(".restaurant-title");
const rating = document.querySelector(".rating");
const mPrice = document.querySelector(".price");
const category = document.querySelector(".category");

let login = localStorage.getItem("galy");

const getData = async function(url) {
  const response = await fetch(url);
  if(!response.ok) {
    throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
  }
  return await response.json();
} 

function toggleModalAuth() {
  modalAuth.classList.toggle("is-open");
}

function toggleModal() {
  modal.classList.toggle("is-open");
}

function autorize() {

  function logOut() {
    login = "";
    buttonOut.removeEventListener("click", logOut)
    checkAuth();
    buttonAuth.style.display = "";
    buttonOut.style.display = "";
    userName.style.display = "";
  }

  userName.textContent = login;

  buttonAuth.style.display = "none";
  buttonOut.style.display = "block";
  userName.style.display = "inline";

  buttonOut.addEventListener("click", logOut)
}

function notAutorize() {
  function logIn(event) {
    event.preventDefault();
    login = loginInput.value;

    if (login == "") {
      alert("Вы не ввели логин");
    }

    localStorage.setItem("galy", login);

    toggleModalAuth();
    logInForm.removeEventListener("submit", logIn)
    buttonAuth.removeEventListener("click", toggleModalAuth);
    closeAuth.removeEventListener("click", toggleModalAuth);
    logInForm.reset();
    checkAuth();

  }

  logInForm.addEventListener("submit", logIn)
  buttonAuth.addEventListener("click", toggleModalAuth);
  closeAuth.addEventListener("click", toggleModalAuth);
}

function checkAuth() {
  if (login) {
    autorize();
  } else {
    notAutorize();
  }
}

function creatCardRestarant(restaurant) {

  const { name, time_of_delivery, stars, price, kitchen, image, products } = restaurant;

  const card = `
      <a class="card card-restaurant" data-products = ${products} data-info = ${[name, kitchen, price, stars]}>
						<img src="${image}" alt="image" class="card-image"/>
						<div class="card-text">
							<div class="card-heading">
								<h3 class="card-title">${name}</h3>
								<span class="card-tag tag">${time_of_delivery} мин</span>
							</div>
							<div class="card-info">
								<div class="rating">
									${stars}
								</div>
								<div class="price">${price} ₽</div>
								<div class="category">${kitchen}</div>
							</div>
						</div>
					</a>
  `;

  cardRestaurants.insertAdjacentHTML("afterbegin", card)
}

function creatCardGood(goods) {
const { id, name, description, price, image} = goods;

  const card = document.createElement("div")
  card.className = "card";
  card.insertAdjacentHTML("afterbegin", `
    <img src=${image} alt="image" class="card-image"/>
    <div class="card-text">
      <div class="card-heading">
        <h3 class="card-title card-title-reg">${name}</h3>
      </div>
      <div class="card-info">
        <div class="ingredients">${description}</div>
      </div>
      <div class="card-buttons">
        <button class="button button-primary button-add-cart">
          <span class="button-card-text">В корзину</span>
          <span class="button-cart-svg"></span>
        </button>
        <strong class="card-price-bold">${price} ₽</strong>
      </div>
  `);
  cardsMenu.insertAdjacentElement("afterbegin", card)


}

function openGood(event) {
  if(login == "") {
    toggleModalAuth(); 
   }else {
  const target = event.target.closest(".card-restaurant");
  const restaurant = target;
   
  if (restaurant) {

    const info = restaurant.dataset.info.split(",");
    const [ name, kitchen, price, stars] = info;

    cardsMenu.textContent = "";
    containerPromo.classList.add("hide");
    restaurants.classList.add("hide");
    menu.classList.remove("hide");

    restaurantTitle.textContent = name;
    rating.textContent = stars;
    mPrice.textContent = `От ${price} Р`;
    category.textContent = kitchen;

    getData(`./db/${restaurant.dataset.products}`).then(function(data){
      data.forEach(creatCardGood);
    });
    
    getData(`./db/partners.json`).then(function(data){
      data.forEach(heading).find(heading === data.name);
    });
  }
}
  
}

function init() {
  getData("./db/partners.json").then(function(data){
    data.forEach(creatCardRestarant)
  });
  
  cartButton.addEventListener("click", toggleModal);
  close.addEventListener("click", toggleModal);
  cardRestaurants.addEventListener("click", openGood);
  logo.addEventListener("click", function () {
    containerPromo.classList.remove("hide")
    restaurants.classList.remove("hide")
    menu.classList.add("hide")
  })
  
  checkAuth();
  creatCardRestarant();
  
}

init();
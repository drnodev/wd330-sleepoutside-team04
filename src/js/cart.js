import { CARTKEY, getLocalStorage, updateCartBadge, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage(CARTKEY) || [];//Starting an empty array in case the local storage key is null to avoid the error: cart.js:5 Uncaught TypeError: Cannot read properties of null (reading 'map').
  const cartMessage = document.getElementById("cart-message");
  if(cartItems.length === 0){ 
      cartMessage.textContent = "Your cart is empty."; //If the cart is empty, Show a message.
      document.querySelector(".product-list").innerHTML = ""; // clear list
      return; // stop further processing
    } 
  cartMessage.textContent = "";  
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Images?.PrimaryMedium|| item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();

//Adding total to cart:
function renderCartItems(){
  const cartItems = getLocalStorage('so-cart') || [];
  if (cartItems.length === 0) {
    return; 
  }

  document.querySelector('.cart-footer').classList.remove('hide');

  if (cartItems.length > 0) {
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += item.FinalPrice;
    }
    document.querySelector('.cart-total').innerHTML = `Total: $${totalAmount}`;
  }
}
renderCartItems();
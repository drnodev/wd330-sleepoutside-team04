import { CARTKEY, getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getLocalStorage(CARTKEY);
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
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

function renderCartItems(){
  const cartItems = getLocalStorage('so-cart') || [];
  if (cartItems.length === 0) {
    console.log("Cart is empty. Hiding total.");
    return; 
  }

  document.querySelector('.cart-footer').classList.remove('hide');

  if (cartItems.length > 0) {
    let totalAmount = 0;
    for (const item of cartItems) {
      // Add each item's finalPrice to the total
      // Use the exact property name from your cart objects (e.g., 'FinalPrice', 'finalPrice')
      totalAmount += item.FinalPrice;
    }

    // Format the total to have 2 decimal places like money
    //const formattedTotal = total.toFixed(2);
    document.querySelector('.cart-total').innerHTML = `Total: $${totalAmount}`;
  }
}

renderCartItems();



/*
// cart.js
import { getLocalStorage } from './utils.mjs'; // Import the function to get the cart

function renderCartContents() {
  // Get the cart items or an empty array if the cart is null/empty
  const cartItems = getLocalStorage('so-cart') || [];

  // 1. Check if the cart is empty
  if (cartItems.length === 0) {
    // Maybe also show a message like "Your cart is empty"
    console.log("Cart is empty. Hiding total.");
    // We do nothing, the .cart-footer div is already hidden by the 'hide' class.
    return; // Exit the function early
  }

  // 2. If we get here, the cart has items!
  // First, show the hidden cart footer element
  document.querySelector('.cart-footer').classList.remove('hide');

  // 3. Calculate the total
  // ...calculation code will go here (Step 3)...

  // 4. Display the total
  // ...display code will go here (Step 4)...
}

// Make sure to call this function when the page loads!
renderCartContents();
*/
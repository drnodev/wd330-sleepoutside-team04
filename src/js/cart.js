import { CARTKEY, getLocalStorage, setLocalStorage, updateCartBadge, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function cartItemActions() {
  const cartList = document.querySelector(".product-list");
  cartList.addEventListener("click", (e) => {
    const removeBtn = e.target.closest(".cart-card__remove a");
    if (!removeBtn) return;
    e.preventDefault();

    const key = removeBtn.dataset.id;
    const li = removeBtn.closest("li.cart-card");
    li.remove();

    const cartItems = getLocalStorage(CARTKEY) || [];
    const newCartItems = cartItems.filter(item => item.Id != key);
    localStorage.setItem(CARTKEY, JSON.stringify(newCartItems));
    renderCartItems()
    updateCartBadge();
  });

  cartList.addEventListener("input", (e) => {
    if (!e.target.classList.contains("cart-card__quantity")) return;

    const input = e.target;
    const newQty = Math.max(1, Math.floor(Number(input.value))); // Garantizar entero >= 1
    input.value = newQty;

    const cartItems = getLocalStorage(CARTKEY) || [];
    const item = cartItems.find(i => i.Id === input.dataset.id);
    if (item) {
      item.qty = newQty;
      setLocalStorage(CARTKEY, cartItems);
      updateCartBadge();
      renderCartContents(); // Opcional si quieres recalcular total
    }
  });
}

function renderCartContents() {
  const cartItems = getLocalStorage(CARTKEY) || [];//Starting an empty array in case the local storage key is null to avoid the error: cart.js:5 Uncaught TypeError: Cannot read properties of null (reading 'map').

  const cartMessage = document.getElementById("cart-message");
  if (cartItems.length === 0) {
    cartMessage.textContent = "Your cart is empty."; //If the cart is empty, Show a message.
    document.querySelector(".product-list").innerHTML = ""; // clear list
    return; // stop further processing
  }
  cartMessage.textContent = "";
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  cartItemActions()
  renderCartItems()
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimaryMedium || item.Image}" alt="${item.Name}" />
    </a>
    <div>
      <a href="#">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    </div>
    <div style="position: relative;">
      <input 
        type="number" 
        class="cart-card__quantity" 
        value="${item.qty || 1}" 
        min="1" 
        step="1" 
        data-id="${item.Id}"
        style="width: 50px;"
      />
      <p class="cart-card__price">$${item.FinalPrice}</p>
      <p class="cart-card__remove" style="position: absolute; top: 0; right: 0">
        <a href="#" data-id="${item.Id}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 7l16 0" />
            <path d="M10 11l0 6" />
            <path d="M14 11l0 6" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </a>
      </p>
    </div>
  </li>`;

  return newItem;
}


renderCartContents();

//Adding total to cart:
function renderCartItems() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartMessage = document.getElementById("cart-message");
  if (cartItems.length === 0) {
    cartMessage.textContent = "Your cart is empty.";
    document.querySelector(".product-list").innerHTML = "";
    document.querySelector('.cart-total').innerHTML = "";
    return;
  }

  document.querySelector('.cart-footer').classList.remove('hide');
  if (cartItems.length > 0) {
    let totalAmount = 0;
    for (const item of cartItems) {
      totalAmount += (item.FinalPrice * (item.qty || 1));
    }
    document.querySelector('.cart-total').innerHTML = `Total: $${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

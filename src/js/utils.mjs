
export const CARTKEY = 'so-cart'

// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}


export function getParam(parameter) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(parameter)

  return product
}

export function renderListWithTemplate(templateFn, parentElement, list, position = "afterbegin", clear = false) {
  if (clear) parentElement.innerHTML = "";
  const htmlItems = list.map((item) => templateFn(item));
  parentElement.insertAdjacentHTML(position, htmlItems.join(""));
}


export function updateCartBadge() {

  const cartItems = JSON.parse(localStorage.getItem(CARTKEY)) || [];
  const count = cartItems.length;

  const cart = document.querySelector(".cart");
  console.log(cart);
  let badge = cart.querySelector(".cart-badge");
  if (count > 0) {
    if (!badge) {
      badge = document.createElement("span");
      badge.classList.add("cart-badge");
      cart.appendChild(badge);
    }
    badge.textContent = count;
  } else {
    if (badge) {
      badge.remove();
    }
  }
}

//W03 Team Activity
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if(callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter(){
  const headerTemplate = await loadTemplate("../partials/header.html");
  const footerTemplate = await loadTemplate("../partials/footer.html");
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
  updateCartBadge();
}

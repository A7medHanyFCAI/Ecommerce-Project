// ========================================================================
// Imports
import { checkBadge } from './productUtilities.js'
import { highlightActiveLink, toggleHamburger } from "./navbarUtilities.js";

// ========================================================================
// Local Storage Data
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

// ========================================================================
// DOM Elements
const cartBadge = document.getElementById("cart-badge");
const heartBadge = document.getElementById("heart-badge");
const shoppingCart = document.querySelector(".cart-items-container");
const orderSummery = document.querySelector(".order-summary");

// Checkout Modal
const modal = document.getElementById("checkoutModal");
const closeBtn = document.querySelector(".close-btn");
const checkoutForm = document.getElementById("checkoutForm");
const successMessage = document.getElementById("successMessage");

// ========================================================================
// Render Cart Item
function createCartItem(Item) {
  return `
    <div class="cart-items" id="${Item.id}">
      <div class="cart-items" id="name-image">
        <div class="item-image">
            <img src="${Item.img}" alt="">
        </div>
        <div class="item-name">
            <h4>${Item.name}</h4>
            <p>#${Item.barcode}</p>
        </div>
      </div>
      <div class="item-details">
        <div class="price-quant">
          <div class="quantity-controls">
            <button class="decreaseQty">-</button>
            <span class="quantity">${Item.quantity || 1}</span>
            <button class="increaseQty">+</button>
          </div>
          <div class="price">
            <div><p class="item-price">${Item.price}</p></div>
            <img src="images/Close.png" alt="" class="removeFromCart">
          </div>
        </div>
      </div>
    </div>
  `;
}

// Initial render
cart.forEach((element) => {
  if (!element.quantity) element.quantity = 1;
  shoppingCart.insertAdjacentHTML("beforeend", createCartItem(element));
});

// ========================================================================
// Order Summary
function updateSummary() {
  let subtotal = 0;

  cart.forEach((item) => {
    const priceNum = Math.round(Number(item.price.slice(1)));
    subtotal += priceNum * item.quantity;
  });

  const tax = 50;
  const shipping = 29;
  const total = subtotal + tax + shipping;

  orderSummery.innerHTML = `
    <h2>Order Summary</h2>
    <div><p><strong>Subtotal</strong></p><p>$${subtotal}</p></div>
    <div><p>Estimates Tax</p><p>$${tax}</p></div>
    <div><p>Estimated shipping</p><p>$${shipping}</p></div>
    <div><p><strong>Total</strong></p><p>$${total}</p></div>
    <button class="checkout">Checkout</button>
  `;
}
updateSummary();

// ========================================================================
// Update Cart Item 
function updateCartItem(card, item) {
  card.querySelector(".quantity").textContent = item.quantity;
  const unitPrice = Number(item.price.slice(1));
  card.querySelector(".item-price").textContent = `$${Math.round(
    unitPrice * item.quantity
  )}`;
}

// ========================================================================
// Quantity Change (+/-)
shoppingCart.addEventListener("click", function (e) {
  if (
    e.target.classList.contains("increaseQty") ||
    e.target.classList.contains("decreaseQty")
  ) {
    const card = e.target.closest(".cart-items");
    const productId = Number(card.id);
    const item = cart.find((elem) => elem.id === productId);

    if (e.target.classList.contains("increaseQty")) {
      item.quantity++;
    } else if (e.target.classList.contains("decreaseQty")) {
      item.quantity = Math.max(item.quantity - 1, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartItem(card, item);
    updateSummary();
  }
});

// ========================================================================
// Remove Item from Cart
shoppingCart.addEventListener("click", function (e) {
  if (e.target && e.target.classList.contains("removeFromCart")) {
    const card = e.target.closest(".cart-items");
    const productId = Number(card.id);

    const index = cart.findIndex((item) => item.id === productId);
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    card.remove();
    updateSummary();

    checkBadge(cartBadge, null, cart);
  }
});

// ========================================================================
// Badges
checkBadge(cartBadge, null, cart);
checkBadge(heartBadge, favorites);

// ========================================================================
// Navbar Utilities
highlightActiveLink();
toggleHamburger();

// ========================================================================
// Checkout Modal Logic
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkout")) {
    modal.style.display = "flex";
  }
});

// Close modal when clicking X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  successMessage.textContent = "";
  checkoutForm.reset();
});

// Close modal when clicking outside
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    successMessage.textContent = "";
    checkoutForm.reset();
  }
});

// Handle form submission
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  successMessage.textContent = "✅ Order placed successfully!";

  // Clear cart
  localStorage.removeItem("cart");
  cart = [];
  shoppingCart.innerHTML = "";
  updateSummary();
  cartBadge.style.display = "none";

  // Auto-close modal after 2 seconds
  setTimeout(() => {
    modal.style.display = "none";
    checkoutForm.reset();
    successMessage.textContent = "";
  }, 2000);
});

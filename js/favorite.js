// =============================
// Imports
// =============================
import * as productUtili from './productUtilities.js';
import * as navUtili from './navbarUtilities.js';


// =============================
// Local Storage Data
// =============================
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];


// =============================
// DOM Elements
// =============================
const products = document.querySelector(".products");
const heartBadge = document.getElementById("heart-badge");
const cartBadge = document.getElementById("cart-badge");


// =============================
// Display Favorite Products
// =============================
favorites.forEach(product => {
  products.insertAdjacentHTML(
    "beforeend", 
    productUtili.createProductCard(product, favorites, cartItems)
  );
});


// =============================
// Badges
// =============================
// Heart badge
productUtili.checkBadge(heartBadge, favorites);

// Cart badge
productUtili.checkBadge(cartBadge, null, cartItems);


// =============================
// Favorite Handling
// =============================
products.addEventListener("click", (e) => 
  productUtili.toggleFavorite(e, heartBadge, favorites, true)
);


// =============================
// Cart Handling
// =============================
// Buy button
products.addEventListener("click", (e) => 
  productUtili.buyProduct(e, cartBadge, cartItems)
);


// =============================
// Product Details
// =============================
products.addEventListener("click", productUtili.openProductDetail);


// =============================
// Open Products Page (Shop buttons)
// =============================
const shop = document.querySelectorAll(".shop");
shop.forEach(btn => {
  btn.addEventListener("click", () => {
    window.location.href = "products.html";
  });
});


// =============================
// Navbar Utilities
// =============================
navUtili.openProductsPage();
navUtili.highlightActiveLink();
navUtili.toggleHamburger();

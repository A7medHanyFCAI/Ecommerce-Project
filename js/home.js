// ========================================================================
// Imports
import * as Categories from './categoriesUtilities.js'
import * as productUtil from './productUtilities.js'
import { fetchProducts } from './fetchProducts.js'
import * as navUtili from './navbarUtilities.js'

// ========================================================================
// Local Storage Data
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// ========================================================================

// Categories
const categoriesContainer = document.querySelector(".categories");
const prevBtn = document.querySelector(".arrow-prev");
const nextBtn = document.querySelector(".arrow-next");

// Products
const newArrivalProducts = document.querySelector(".products");
const discountedProducts = document.querySelector(".discounted-products");
const viewMoreBtn = document.querySelector(".view");

// Badges
const heartBadge = document.getElementById('heart-badge');
const cartBadge = document.getElementById('cart-badge');

// ========================================================================

let countCategories = Categories.getCategoryCount();
let start = 0;

let allProducts = [];
let arrivals = [];
let discounts = [];

// ========================================================================
// Category Slider
window.addEventListener("resize", () =>
  countCategories = Categories.resize(start, countCategories, categoriesContainer)
);

nextBtn.addEventListener("click", () =>
  start = Categories.nextBtnFun(start, countCategories, categoriesContainer)
);

prevBtn.addEventListener("click", () =>
  start = Categories.prevBtnFun(start, countCategories, categoriesContainer)
);

Categories.displayCategories(start, countCategories, categoriesContainer);

// Navigate to products page with selected category
function passCategory(e) {
  if (e.target && e.target.classList.contains("category")) {
    const categoryCard = e.target.closest(".category-card");
    const category = categoryCard.querySelector("p").textContent;
    window.location.href = `products.html?category=${category}`;
  }
}
categoriesContainer.addEventListener("click", passCategory);

// ========================================================================
// Fetch + Display Products
async function fetching() {
  allProducts = await fetchProducts();

  arrivals = allProducts.slice(110, 118);
  discounts = allProducts.slice(100, 104);

  productUtil.displayProducts(newArrivalProducts, arrivals, favorites, cartItems);
  productUtil.displayProducts(discountedProducts, discounts, favorites, cartItems);
}
fetching();

// ========================================================================
// View More / View Less
function viewMore() {
  if (viewMoreBtn.textContent === "View More") {
    productUtil.displayProducts(newArrivalProducts, arrivals, favorites, cartItems, arrivals.length);
    viewMoreBtn.textContent = "View Less";
  } else {
    productUtil.displayProducts(newArrivalProducts, arrivals, favorites, cartItems);
    viewMoreBtn.textContent = "View More";
  }
}
viewMoreBtn.addEventListener("click", viewMore);

// ========================================================================
// Favorites
productUtil.checkBadge(heartBadge, favorites);

[newArrivalProducts, discountedProducts].forEach(section => {
  section.addEventListener("click", e =>
    productUtil.toggleFavorite(e, heartBadge, favorites)
  );
});

// ========================================================================
// Cart
productUtil.checkBadge(cartBadge, null, cartItems);

[newArrivalProducts, discountedProducts].forEach(section => {
  section.addEventListener("click", e =>
    productUtil.buyProduct(e, cartBadge, cartItems)
  );
});

// ========================================================================
// Product Details
[newArrivalProducts, discountedProducts].forEach(section => {
  section.addEventListener("click", productUtil.openProductDetail);
});

// ========================================================================
// Navbar Utilities
navUtili.openProductsPage();
navUtili.highlightActiveLink();
navUtili.toggleHamburger();

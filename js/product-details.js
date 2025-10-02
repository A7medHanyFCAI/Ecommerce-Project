// =============================
// Imports
// =============================
import * as productUtili from './productUtilities.js';
import { highlightActiveLink, toggleHamburger } from './navbarUtilities.js';


// =============================
// Local Storage Data
// =============================
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// =============================
// DOM Elements
// =============================
const params = new URLSearchParams(window.location.search);
const itemId = params.get("id");

const heartBadge = document.getElementById("heart-badge");
const cartBadge = document.getElementById("cart-badge");

const productTitle = document.querySelector(".product-title");
const quantity = document.getElementById("quantity");
const decreaseQty = document.getElementById("decreaseQty");
const increaseQty = document.getElementById("increaseQty");


// =============================
// Badges
// =============================
productUtili.checkBadge(cartBadge, null, cart);
productUtili.checkBadge(heartBadge, favorites);


// =============================
// Fetch & Display Product
// =============================
async function fetchProductDetails() {
  const response = await fetch(`https://dummyjson.com/products/${itemId}`);
  const product = await response.json();
  displayProductDetails(product);
}
fetchProductDetails();


// =============================
// Display Product Details
// =============================
function displayProductDetails(product) {
  // Title
  productTitle.textContent = product.title;

  // Price & Discount
  const discountedPrice = (
    Number(product.price) /
    (1 + (Number(product.discountPercentage).toFixed() / 100))
  ).toFixed();

  document.querySelector(".product-price").textContent = `$${discountedPrice}`;
  document.querySelector(".product-discount").textContent = `$${product.price}`;
  document.getElementById("percentage").textContent = 
    `-${Number(product.discountPercentage).toFixed()}%`;

  // Rating
  const rating = Number(product.rating).toFixed(1);
  document.querySelector(".rating-text").textContent = `${rating}/5`;

  document.querySelectorAll(".stars").forEach(starBlock => {
    const percentage = (rating / 5) * 100;
    starBlock.querySelector(".stars-inner").style.width = `${percentage}%`;
  });

  // Main image
  document.querySelector(".main-image").src = product.images[0];

  // Thumbnails
  const thumbsContainer = document.querySelector(".thumbnail-images");
  thumbsContainer.innerHTML = "";
  product.images.forEach(img => {
    const thumb = document.createElement("img");
    thumb.src = img;
    thumb.addEventListener("click", () => {
      document.querySelector(".main-image").src = img;
    });
    thumbsContainer.appendChild(thumb);
  });

  // Mini description
  document.getElementById("desc").textContent = product.description;

  // Shipping
  let shipping = product.shippingInformation;
  if (shipping.startsWith("Ships in ")) {
    shipping = shipping.slice("Ships in ".length);
  } else if (shipping.startsWith("Ships ")) {
    shipping = shipping.slice("Ships ".length);
  }
  shipping = shipping.replace("business ", "");
  document.getElementById("shipping").textContent = shipping;

  // Stock & Warranty
  document.getElementById("stock").textContent = product.availabilityStatus;
  let warranty = product.warrantyInformation.split(" ");
  warranty = warranty.length === 2 ? warranty[0] : warranty.slice(0, 2).join(" ");
  document.getElementById("warranty").textContent = warranty;

  // Extra details
  const detailsList = document.getElementById("productDetailsList");
  detailsList.innerHTML = `
    ${product.brand ? `<p><strong>Brand:</strong> ${product.brand}</p>` : ""}
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>SKU:</strong> ${product.sku}</p>
    <p><strong>Weight:</strong> ${product.weight}g</p>
    <p><strong>Product Dimensions:</strong> ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} inches</p>
    <p><strong>Return Policy:</strong> ${product.returnPolicy}</p>
  `;

  // Reviews
  displayReviews(product.reviews);

  // Add to Cart
  setupAddToCart(product, discountedPrice);

  // Add to Wishlist
  setupWishlist(product);
}


// =============================
// Reviews
// =============================
function displayReviews(reviews) {
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "";
  reviews.forEach(rev => {
    const percentage = (rev.rating / 5) * 100;
    const reviewHTML = `
      <div class="review-card">
        <p class="review-author">${rev.reviewerName}</p>
        <div class="review-stars">
          <span class="stars-outer">
            <span class="stars-inner" style="width:${percentage}%"></span>
          </span>
          <span>${rev.rating}/5</span>
        </div>
        <p class="review-body">${rev.comment}</p>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", reviewHTML);
  });
}


// =============================
// Cart Handling
// =============================
function setupAddToCart(product, discountedPrice) {
  const addToCartBtn = document.getElementById("addToCartBtn");
  const inCart = cart.some(item => item.id === product.id);

  if (inCart) {
    addToCartBtn.textContent = "Item in Cart";
  }

  addToCartBtn.addEventListener("click", () => {
    const index = cart.findIndex(item => item.id === product.id);

    if (index === -1) {
      cart.push({
        id: product.id,
        name: product.title,
        price: `$${discountedPrice}`,
        img: product.images[0],
        quantity: Number(quantity.textContent),
        barcode: product.meta.barcode
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      addToCartBtn.textContent = "Item in Cart";
      productUtili.checkBadge(cartBadge, null, cart);
    }
  });
}


// =============================
// Wishlist Handling
// =============================
function setupWishlist(product) {
  const addToWishBtn = document.getElementById("addToWishlist");
  const inFav = favorites.some(fav => fav.id === product.id);

  if (inFav) {
    addToWishBtn.textContent = "Item in Wishlist";
  }

  addToWishBtn.addEventListener("click", () => {
    const index = favorites.findIndex(fav => fav.id === product.id);

    if (index === -1) {
      favorites.push({
        id: product.id,
        title: product.title,
        price: product.price,
        img: product.images[0]
      });

      localStorage.setItem("favorites", JSON.stringify(favorites));
      addToWishBtn.textContent = "Item in Wishlist";
      productUtili.checkBadge(heartBadge, favorites);
    }
  });
}


// =============================
// Quantity Controls
// =============================
decreaseQty.addEventListener("click", () => {
  let q = Math.max(Number(quantity.textContent) - 1, 1);
  quantity.textContent = q;
});

increaseQty.addEventListener("click", () => {
  let q = Number(quantity.textContent);
  quantity.textContent = q + 1;
});


// =============================
// Navbar Utilities
// =============================
highlightActiveLink();
toggleHamburger();

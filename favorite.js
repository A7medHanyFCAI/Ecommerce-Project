import * as productUtili from './productUtilities.js'

const favorites = JSON.parse(localStorage.getItem("favorites")) || []
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
const products = document.querySelector(".products")

// display favorite Products
favorites.forEach(product => {
    products.insertAdjacentHTML("beforeend", productUtili.createProductCard(product,favorites,cartItems))
});

// heart Badge
const heartBadge = document.getElementById('heart-badge')

productUtili.checkBadge(heartBadge,favorites)

// Remove favorite cards

products.addEventListener("click", (e)=>
productUtili.toggleFavorite(e, heartBadge, favorites,true));

//=======================================================================

// cart badge
const cartBadge = document.getElementById('cart-badge')

productUtili.checkBadge(cartBadge,null,cartItems)


// Buy Button

products.addEventListener("click", (e)=>
  productUtili.buyProduct(e,cartBadge,cartItems));


//========================================================================

// Open Product details

products.addEventListener("click", productUtili.openProductDetail);


//========================================================================
// Open Products Page

const shop = document.querySelectorAll(".shop")
shop.forEach(btn=>{
  btn.addEventListener('click', function(){
   window.location.href = `products.html`;

})
})

//===================================================================
// Highlight active link based on URL
import * as navUtili from './navbarUtilities.js'

// Open Products Page

navUtili.openProductsPage()

// Highlight active link based on URL
navUtili.highlightActiveLink()

// hamburger menu
navUtili.toggleHamburger()
import * as Categories from './categoriesUtilities.js'

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// Categories 
const categoriesContainer = document.querySelector(".categories");
const prevBtn = document.querySelector(".arrow-prev");
const nextBtn = document.querySelector(".arrow-next");

let countCategories = Categories.getCategoryCount();
let start = 0;


// Update on window resize
window.addEventListener("resize", ()=>
  countCategories = Categories.resize(start,countCategories,categoriesContainer));

// next Button
nextBtn.addEventListener('click',()=>
  start = Categories.nextBtnFun(start,countCategories,categoriesContainer

  ));

// Pervious Button
prevBtn.addEventListener('click',()=>
  start = Categories.prevBtnFun(start,countCategories,categoriesContainer

  ));


Categories.displayCategories(start, countCategories,categoriesContainer,);



function passCategory(e){
  if (e.target && e.target.classList.contains("category")){
    const categoryCard = e.target.closest(".category-card")
    const category = categoryCard.querySelector("p").textContent;
    window.location.href = `products.html?category=${category}`
  }
}
categoriesContainer.addEventListener("click",passCategory)


// ========================================================================
import * as productUtil from './productUtilities.js'
import {fetchProducts} from './fetchProducts.js'

const newArrivalProducts = document.querySelector(".products")
const dicountedProducts = document.querySelector(".discounted-products")


let allProducts = []
let arrivals = [];
let discounts = [];

async function fetching() {
   
    allProducts = await fetchProducts();
  
    
    arrivals = allProducts.slice(110, 118);
    discounts = allProducts.slice(100, 104);

    productUtil.displayProducts(newArrivalProducts,arrivals,favorites,cartItems)
    productUtil.displayProducts(dicountedProducts,discounts,favorites,cartItems)
}

fetching()

// View More/Less
const viewMoreBtn = document.querySelector(".view")

function viewMore(){
  if (viewMoreBtn.textContent === "View More"){
   
    productUtil.displayProducts(newArrivalProducts,arrivals,favorites,cartItems,arrivals.length)
    viewMoreBtn.textContent = "View Less"
  }
  else{
    productUtil.displayProducts(newArrivalProducts,arrivals,favorites,cartItems)
    viewMoreBtn.textContent = "View More"
  }
}

viewMoreBtn.addEventListener("click", viewMore);

//============================================================================
// Add/Remove to Favorite
const heartBadge = document.getElementById('heart-badge')

productUtil.checkBadge(heartBadge,favorites)

newArrivalProducts.addEventListener("click",(e) => 
  productUtil.toggleFavorite(e, heartBadge,favorites));

dicountedProducts.addEventListener("click", (e) => 
  productUtil.toggleFavorite(e, heartBadge,favorites));

//========================================================================

const cartBadge = document.getElementById('cart-badge')

productUtil.checkBadge(cartBadge,null,cartItems)

// Buy Button

newArrivalProducts.addEventListener("click", (e)=>
  productUtil.buyProduct(e,cartBadge,cartItems));
dicountedProducts.addEventListener("click", (e)=>
  productUtil.buyProduct(e,cartBadge,cartItems));

//========================================================================

// Open Product details

newArrivalProducts.addEventListener("click", productUtil.openProductDetail);
dicountedProducts.addEventListener("click", productUtil.openProductDetail);

//========================================================================
import * as navUtili from './navbarUtilities.js'
// Open Products Page

navUtili.openProductsPage()

// Highlight active link based on URL
navUtili.highlightActiveLink()

// hamburger menu
navUtili.toggleHamburger()
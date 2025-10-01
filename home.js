import * as Categories from './categoriesUtilities.js'

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


Categories.displayCategories(start, countCategories,categoriesContainer);



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

    productUtil.displayProducts(newArrivalProducts,arrivals)
    productUtil.displayProducts(dicountedProducts,discounts)
}

fetching()

// View More/Less
const viewMoreBtn = document.querySelector(".view")

function viewMore(){
  if (viewMoreBtn.textContent === "View More"){
    productUtil.displayProducts(newArrivalProducts,arrivals,arrivals.length)
    viewMoreBtn.textContent = "View Less"
  }
  else{
    productUtil.displayProducts(newArrivalProducts,arrivals)
    viewMoreBtn.textContent = "View More"
  }
}

viewMoreBtn.addEventListener("click", viewMore);

//============================================================================
// Add/Remove to Favorite

const heartBadge = document.getElementById('heart-badge')

if (favorites.length>0){
  heartBadge.style.display = 'inline'
  heartBadge.textContent = favorites.length
}
else{
  heartBadge.style.display = 'none'
}

function toggleFavorite(e) {
  if (e.target && e.target.classList.contains("favourite-icon")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);
    
    const index = favorites.findIndex(fav => fav.id === productId);

    if (index === -1) {
     
      const img = card.querySelector(".product-img").src;
      const name = card.querySelector(".product-name").textContent;
      const price = card.querySelector(".product-price").textContent;
      const barcode = card.dataset.barcode
      favorites.push({ id: productId, img: img, title: name, price: price , barcode:barcode});
      card.classList.add("favorited");

      
    } else {
    
      favorites.splice(index, 1);
      card.classList.remove("favorited");
    }
    if (favorites.length>0){
      heartBadge.style.display = 'inline'
      heartBadge.textContent = favorites.length
    }
    else{
      heartBadge.style.display = 'none'
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

newArrivalProducts.addEventListener("click", toggleFavorite);
dicountedProducts.addEventListener("click", toggleFavorite);

//========================================================================

const cartBadge = document.getElementById('cart-badge')
if (cartItems.length>0){
  cartBadge.style.display = 'inline'
  cartBadge.textContent = cartItems.length
}
else{
  cartBadge.style.display = 'none'
}
// Buy Button


function buyProduct(e) {
  if (e.target && e.target.classList.contains("buy")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);

    

    const img = card.querySelector(".product-img").src;
    const name = card.querySelector(".product-name").textContent;
    const price = card.querySelector(".product-price").textContent;
    const barcode = card.dataset.barcode
    cartItems.push({ id: productId, img, name, price, quantity: 1, barcode:barcode });
    localStorage.setItem("cart", JSON.stringify(cartItems));   
    
    if (cartItems.length>0){
      cartBadge.style.display = 'inline'
      cartBadge.textContent = cartItems.length
    }
    else{
      cartBadge.style.display = 'none'
    }

    e.target.textContent = "Item in Cart";
    e.target.disabled = true;
  }
}

newArrivalProducts.addEventListener("click", buyProduct);
dicountedProducts.addEventListener("click", buyProduct);

//========================================================================

// Open Product details

function openProductDetail(e) {
  if (e.target && e.target.classList.contains("product-img")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);

    window.location.href = `product-details.html?id=${productId}`;
  }
}


newArrivalProducts.addEventListener("click", openProductDetail);
dicountedProducts.addEventListener("click", openProductDetail);

//========================================================================
// Open Products Page

const shop = document.querySelectorAll(".shop")
const navLinks = document.querySelector(".nav-links")
const anchors = navLinks.querySelectorAll(".nav-link");

// Highlight active link based on URL
const currentPage = window.location.pathname.split("/").pop();
anchors.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

shop.forEach(btn=>{
  btn.addEventListener('click', function(){
   window.location.href = `products.html`;

})
})


const hamburger = document.querySelector(".hamburger");
const navLinksContainer = document.querySelector(".nav-links");

hamburger.addEventListener("click", () => {
  navLinksContainer.classList.toggle("open");
  hamburger.classList.toggle("active");
});

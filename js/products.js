import * as Categories from './categoriesUtilities.js'
import * as productUtil from './productUtilities.js'
import { fetchProducts } from './fetchProducts.js'
import * as navUtili from './navbarUtilities.js'

// LocalStorage
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

// DOM Elements
const categoriesContainer = document.querySelector(".categories");
const prevBtn = document.querySelector(".arrow-prev");
const nextBtn = document.querySelector(".arrow-next");
const productsData = document.getElementById("products");
const pagination = document.getElementById("pagination");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const heartBadge = document.getElementById('heart-badge')
const cartBadge = document.getElementById('cart-badge')

// ===================================================================================

let countCategories = Categories.getCategoryCount();
let start = 0;

let allProducts = [];
let currentProducts = [];
let currentPage = 1;
const perPage = 12;

let activeCategories = [];
let searchTerm = "";
let currentSort = "default";

const includedCategories = {
  'Electronics': ['laptops', 'mobile-accessories', 'smartphones','tablets'],
  'Groceries': ['groceries'],
  'Vehicles': ['motorcycle','vehicle'],
  'Sports': ['sports-accessories'],
  'Furniture': ['furniture', 'home-decoration'],
  'Men Section':['mens-shirts', 'mens-shoes', 'mens-watches', 'sunglasses'],
  'Women Section': ['tops', 'beauty', "womens-bags","womens-dresses","womens-jewellery","womens-shoes","womens-watches",'skin-care'],
  'Kitchen': ['kitchen-accessories'],
  'Fragrances': ['fragrances']
};

// ===================================================================================
// Category slider
window.addEventListener("resize", () =>
  countCategories = Categories.resize(start,countCategories,categoriesContainer));

nextBtn.addEventListener('click', () =>
  start = Categories.nextBtnFun(start,countCategories,categoriesContainer));

prevBtn.addEventListener('click', () =>
  start = Categories.prevBtnFun(start,countCategories,categoriesContainer));

Categories.displayCategories(start, countCategories, categoriesContainer);

// ===================================================================================
// Fetch + Init
async function fetching() {
  allProducts = await fetchProducts();

  const params = new URLSearchParams(window.location.search);
  const category = params.get("category");

  if (category){
    activeCategories = [category];
    document.querySelectorAll('.category-card p').forEach(p =>{
      if(p.textContent === category){
        p.closest(".category-card").classList.add("active-category")
      }
    })
  }

  applyFilters();
}
fetching();

// ===================================================================================
// Filtering pipeline (search + categories + sorting)
function applyFilters() {
  let filtered = [...allProducts];

  // category filter
  if (activeCategories.length > 0) {
    filtered = filtered.filter(prod =>
      activeCategories.some(cat => includedCategories[cat]?.includes(prod.category))
    );
  }

  // search filter
  if (searchTerm) {
    filtered = filtered.filter(prod =>
      prod.title.toLowerCase().includes(searchTerm) ||
      prod.description.toLowerCase().includes(searchTerm)
    );
  }

  // sorting
  if (currentSort === "low-high") {
    filtered.sort((a,b)=>a.price - b.price);
  } else if (currentSort === "high-low") {
    filtered.sort((a,b)=>b.price - a.price);
  } else if (currentSort === "az") {
    filtered.sort((a,b)=>a.title.localeCompare(b.title));
  } else if (currentSort === "za") {
    filtered.sort((a,b)=>b.title.localeCompare(a.title));
  }

  currentProducts = filtered;
  currentPage = 1;
  renderProducts();
  renderPagination();
}

// ===================================================================================
// Rendering
function renderProducts() {
  productsData.innerHTML = ""; 

  const startIdx = (currentPage - 1) * perPage;
  const endIdx = startIdx + perPage;
  const pageProducts = currentProducts.slice(startIdx, endIdx);

  pageProducts.forEach(product => {
    productsData.insertAdjacentHTML("beforeend", productUtil.createProductCard(product,favorites,cartItems));
  });
}

function renderPagination() {
  pagination.innerHTML = ""; 
  const totalPages = Math.ceil(currentProducts.length / perPage);

  for (let i=1;i<=totalPages;i++){
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.toggle("active", i === currentPage);

    btn.addEventListener("click", ()=>{
      currentPage = i;
      renderProducts();
      renderPagination();
    });

    pagination.appendChild(btn);
  }
}

// ===================================================================================
// Events
categoriesContainer.addEventListener("click", e => {
  if (e.target && e.target.classList.contains("category")) {
    const categoryCard = e.target.closest(".category-card");
    const category = categoryCard.querySelector("p").textContent;

    if (activeCategories.includes(category)) {
      activeCategories = activeCategories.filter(c => c !== category);
      categoryCard.classList.remove("active-category");
    } else {
      activeCategories.push(category);
      categoryCard.classList.add("active-category");
    }

    applyFilters();
  }
});

sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  applyFilters();
});

searchInput.addEventListener("input", () => {
  searchTerm = searchInput.value.trim().toLowerCase();
  applyFilters();
});

// ===================================================================================
// Favorites + Cart + Product detail
productUtil.checkBadge(heartBadge,favorites)
productsData.addEventListener("click", e =>
  productUtil.toggleFavorite(e,heartBadge,favorites));

productUtil.checkBadge(cartBadge,null,cartItems)
productsData.addEventListener("click", e =>
  productUtil.buyProduct(e,cartBadge,cartItems));

productsData.addEventListener("click", productUtil.openProductDetail);

// ===================================================================================
// Navbar utils
navUtili.highlightActiveLink()
navUtili.toggleHamburger()

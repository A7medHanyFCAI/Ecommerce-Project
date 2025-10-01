// Categories 
const categories = [
    { image:"images/responsive.png", title:"Electronics" },
    { image:"images/grocery.png", title:"Groceries" },
    { image:"images/vehicles.png", title:"Vehicles" },
    { image:"images/sports.png", title:"Sports" },
    { image:"images/sofa.png", title:"Furniture" },
    { image:"images/man.png", title:"Men Section" },
    { image:"images/woman.png", title:"Women Section" },
    { image:"images/kitchen.png", title:"Kitchen" },
    { image:"images/perfume.png", title:"Fragrances" }
];

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
}

const categoriesContainer = document.querySelector(".categories");
const prevBtn = document.querySelector(".arrow-prev");
const nextBtn = document.querySelector(".arrow-next");

const count = 6; 
let start = 0;

function displayCategories(start, count) {
    categoriesContainer.innerHTML = "";
    const visible = [];
    for (let i = 0; i < count; i++) {
        const index = (start + i) % categories.length;
        visible.push(categories[index]);
    }
    visible.forEach(cat => {
        let card = `
        <div class="category-card">
            <img src="${cat.image}" alt="" class="category">
            <p class="category">${cat.title}</p>
        </div>`;
        categoriesContainer.insertAdjacentHTML('beforeend', card);
    });
}

nextBtn.addEventListener('click', function() {
 
        start = (start + 1) % categories.length;
        displayCategories(start, count);
    
});

prevBtn.addEventListener('click', function() {

        start = (start - 1 + categories.length) % categories.length;
        displayCategories(start, count);
  
});

displayCategories(start, count);
// =====================================================================================

// Fetch products and display products

const productsData = document.getElementById("products");
const pagination = document.getElementById("pagination");
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
let currentProducts = [];
let baseProducts = [];
let currentPage = 1;
const perPage = 12;



let allProducts = [];


async function fetchProducts() {
  let response = await fetch("https://dummyjson.com/products?limit=194");
  let data = await response.json();
  allProducts = data.products;
  const params = new URLSearchParams(window.location.search);
  const category =  params.get("category");
  if (category){
    const filtered = allProducts.filter(prod=>
      includedCategories[category].includes(prod.category))

    currentProducts= [...filtered]
    baseProducts= [...filtered]
    renderProducts(filtered)
    renderPagination(filtered)
    
    const categoryCards = document.querySelectorAll('.category-card p')
    categoryCards.forEach(p =>{
      if(p.textContent === category){
        p.closest(".category-card").classList.add("active-category")
      }
    })
  }else{
    currentProducts= [...allProducts]
    baseProducts= [...allProducts]
  renderProducts(allProducts)
  renderPagination(allProducts)
  }
  
}

function renderProducts(products) {
  productsData.innerHTML = ""; // clear old products

  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  const pageProducts = products.slice(start, end);

  pageProducts.forEach(product => {
    productsData.insertAdjacentHTML("beforeend", createProductCard(product));
  });
}


function renderPagination(products) {
  pagination.innerHTML = ""; 

  const totalPages = Math.ceil(products.length / perPage);

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.classList.toggle("active", i === currentPage);

    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts(products);
      renderPagination(products);
    });

    pagination.appendChild(btn);
  }
}

function createProductCard(product) {
 
  const isFavorited = favorites.some(fav => fav.id === product.id);

  
  const inCart = cartItems.some(item => item.id === product.id)

  return `
    <div class="product-card ${isFavorited ? "favorited" : ""}" 
     id="${product.id}" 
     data-barcode="${product.meta.barcode}">

      <div class="favourite">
        <img class="favourite-icon" alt="">
      </div>
      <div>
        <img src="${product.images[0]}" alt=" " class="product-img">
      </div>
      <div class="product-desc">
        <p class="product-name">${product.title}</p>
        <p class="product-price"><strong>$${product.price}</strong></p>
      </div>
      <div>
        <button class="buy" ${inCart ? "disabled" : ""}>
          ${inCart ? "Item in Cart" : "Buy Now"}
        </button>
      </div>
    </div>
  `;
}

fetchProducts()


//==================================================================================================
// Filter by Categories



let activeCategories = [];


function filterByCategory(e) {
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

   
    let filteredProducts = [];

    if (activeCategories.length === 0) {
      filteredProducts = [...allProducts];
    } else {
      for(let cat of activeCategories){
        allProducts.forEach(prod=>{
          if (includedCategories[cat].includes(prod.category)){
            filteredProducts.push(prod);
          }
        })
      }
      
    }

    baseProducts = [...filteredProducts];     
    currentProducts = [...filteredProducts];
    currentPage = 1;
    renderProducts(currentProducts);
    renderPagination(currentProducts);
  }
}


categoriesContainer.addEventListener("click", filterByCategory)


//=============================================================================================
// Sort data

const sortSelect = document.getElementById("sortSelect");

function sortProducts(option) {
  let sorted = [...currentProducts]; 

  if (option === "low-high") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (option === "high-low") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (option === "az") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (option === "za") {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  } else{
    sorted = [...currentProducts]; 

  }
  currentPage = 1;
  renderProducts(sorted);
  renderPagination(sorted);
}

sortSelect.addEventListener("change", () => {
  const selectedOption = sortSelect.value;
  sortProducts(selectedOption);
});

//=================================================================================================
// Search through data

searchInput.addEventListener("input", () => {
  const term = searchInput.value.trim().toLowerCase();

  if (term) {
    let filtered = baseProducts.filter(prod =>
      prod.title.toLowerCase().includes(term) ||
      prod.description.toLowerCase().includes(term)
    );

    currentProducts = [...filtered];
    currentPage = 1;
    renderProducts(currentProducts);
    renderPagination(currentProducts);

  } else {
    currentProducts = [...baseProducts];  
    currentPage = 1;
    renderProducts(currentProducts);
    renderPagination(currentProducts);
  }
});


// ======================================================================================================
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

productsData.addEventListener("click", toggleFavorite);


// ======================================================================================================
// Buy Button
const cartBadge = document.getElementById('cart-badge')
if (cartItems.length>0){
  cartBadge.style.display = 'inline'
  cartBadge.textContent = cartItems.length
}
else{
  cartBadge.style.display = 'none'
}

function buyProduct(e) {
  if (e.target && e.target.classList.contains("buy")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

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

productsData.addEventListener("click", buyProduct);



// Open Product details

function openProductDetail(e) {
  if (e.target && e.target.classList.contains("product-img")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);

    window.location.href = `product-details.html?id=${productId}`;
  }
}


productsData.addEventListener("click", openProductDetail);

//===================================================================
// Highlight active link based on URL
const navLinks = document.querySelector(".nav-links")
const anchors = navLinks.querySelectorAll(".nav-link");


const currentPage_ = window.location.pathname.split("/").pop();
anchors.forEach(link => {
  if (link.getAttribute("href") === currentPage_) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});



let favorites = JSON.parse(localStorage.getItem("favorites")) || []
const products = document.querySelector(".products")
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

function createFavoriteProductCard(product) {
  
  const isFavorited = favorites.some(fav => fav.id === product.id);

  
  const inCart = cartItems.some(item => item.id === product.id)

  return`
    <div class="product-card ${isFavorited ? "favorited" : ""}" 
     id="${product.id}" 
     data-barcode="${product.barcode}">

      <div class="favourite">
        <img class="favourite-icon" alt="">
      </div>
      <div>
        <img src="${product.img}" alt=" " class="product-img">
      </div>
      <div class="product-desc">
        <p class="product-name">${product.title}</p>
        <p class="product-price"><strong>${product.price}</strong></p>
      </div>
      <div>
        <button class="buy" ${inCart ? "disabled" : ""}>
          ${inCart ? "Item in Cart" : "Buy Now"}
        </button>
      </div>
    </div>
  `;
}

favorites.forEach(product => {
    products.insertAdjacentHTML("beforeend",createFavoriteProductCard(product))
});

const heartBadge = document.getElementById('heart-badge')
if (favorites.length>0){
  heartBadge.style.display = 'inline'
  heartBadge.textContent = favorites.length
}
else{
  heartBadge.style.display = 'none'
}
function removeFavorite(e) {
    if (e.target && e.target.classList.contains("favourite-icon")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.dataset.id);
    const index = favorites.findIndex(fav => fav.id === productId);
    favorites.splice(index, 1);
    card.classList.remove("favorited");
    localStorage.setItem("favorites", JSON.stringify(favorites));
    card.remove();
    if (favorites.length>0){
      heartBadge.style.display = 'inline'
      heartBadge.textContent = favorites.length
    }
    else{
      heartBadge.style.display = 'none'
    }
    }
}

products.addEventListener("click", removeFavorite);

//=======================================================================

// Buy Button
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

products.addEventListener("click", buyProduct);


//========================================================================

// Open Product details

function openProductDetail(e) {
  if (e.target && e.target.classList.contains("product-img")) {
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);

    
    window.location.href = `product-details.html?id=${productId}`;
  }
}


products.addEventListener("click", openProductDetail);


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
const navLinks = document.querySelector(".nav-links")
const anchors = navLinks.querySelectorAll(".nav-link");


const currentPage = window.location.pathname.split("/").pop();
anchors.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Get the id from URL
const params = new URLSearchParams(window.location.search);
const heartBadge = document.getElementById('heart-badge')

const cartBadge = document.getElementById('cart-badge')
const itemId = params.get('id')
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length>0){
  cartBadge.style.display = 'inline'
  cartBadge.textContent = cart.length
}
else{
  cartBadge.style.display = 'none'
}
if (favorites.length>0){
  heartBadge.style.display = 'inline'
  heartBadge.textContent = favorites.length
}
else{
  heartBadge.style.display = 'none'
}
async function fetchProductDetails(){
  const response = await fetch(`https://dummyjson.com/products/${itemId}`)
  const product = await response.json();

  displayProductDetails(product)
}
function displayProductDetails(product){
  // Product Title
  const productTitle = document.querySelector(".product-title")
  productTitle.textContent = product.title

  // Product Price
  const discountedPrice = (Number(product.price) / (1+(Number(product.discountPercentage).toFixed()/100))).toFixed()

  document.querySelector(".product-price").textContent = `$${discountedPrice}`
  document.querySelector(".product-discount").textContent = `$${product.price}`
  document.getElementById("percentage").textContent = `-${Number(product.discountPercentage).toFixed()}%`

  // Product Rating
  const rating = Number(product.rating).toFixed(1)
  
  const ratingText = document.querySelector(".rating-text")

  ratingText.textContent = `${rating}/5`

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
    let thumb = document.createElement("img");
    thumb.src = img;
    thumb.addEventListener("click", () => {
      document.querySelector(".main-image").src = img;
    });
    thumbsContainer.appendChild(thumb);
  });

  // mini desc
  document.getElementById("desc").textContent = product.description

  let shipping = product.shippingInformation ;
  if (shipping.startsWith("Ships in ")){
    shipping = shipping.slice("Ships in ".length);
  } 
  else if(shipping.startsWith("Ships ")){
    shipping = shipping.slice("Ships ".length);
  }
  shipping = shipping.replace("business ", "");

  document.getElementById("shipping").textContent = shipping
  document.getElementById("stock").textContent = product.availabilityStatus
  let warranty = product.warrantyInformation.split(" ")
  console.log(warranty)
  if( warranty.length === 2){
    warranty = warranty[0];
  }
  else{
    warranty = warranty.slice(0,2).join(" ");
    console.log(warranty)
  }
  document.getElementById("warranty").textContent = warranty


  const detailsList = document.getElementById("productDetailsList");
  detailsList.innerHTML = `
    <p><strong>Brand:</strong> ${product.brand}</p>
    <p><strong>Category:</strong> ${product.category}</p>
    <p><strong>SKU:</strong> ${product.sku}</p>
    <p><strong>Weight:</strong> ${product.weight}g</p>
    <p><strong>Product Dimensions:</strong> ${product.dimensions.width} x ${product.dimensions.height} x ${product.dimensions.depth} inches</p>
    <p><strong>Return Policy:</strong> ${product.returnPolicy}</p>
  `;
  displayReviews(product.reviews)

  // Add to Cart
const addToCartBtn = document.getElementById("addToCartBtn")
let price = `$${discountedPrice}`
addToCartBtn.addEventListener("click", () => {
 
  const index = cart.findIndex(item => item.id === product.id);
  if (index === -1){
     cart.push({ id: product.id, name: product.title, price: price, img: product.images[0], quantity: Number(quantity.textContent), barcode:product.meta.barcode});
    localStorage.setItem("cart", JSON.stringify(cart));
    addToCartBtn.textContent = "Item in Cart"
  }
  else{
    addToCartBtn.textContent = "Item in Cart"
  }
  if (cart.length>0){
    cartBadge.style.display = 'inline'
    cartBadge.textContent = cart.length
  }
  else{
    cartBadge.style.display = 'none'
  }
});


const addToWishBtn = document.getElementById("addToWishlist")
// Add to Wishlist
  addToWishBtn.addEventListener("click", () => {
  
  const index = favorites.findIndex(fav => fav.id === product.id);
  if (index==-1){
    favorites.push({ id: product.id, title: product.title, price: product.price, img: product.images[0] });
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
  else{
    addToWishBtn.textContent = "Item in Wishlist"
  }
  if (favorites.length>0){
    heartBadge.style.display = 'inline'
    heartBadge.textContent = favorites.length
  }
  else{
    heartBadge.style.display = 'none'
  }
});
}

fetchProductDetails()


//Reviews

function displayReviews(reviews) {
  const container = document.getElementById("reviewsContainer");
  container.innerHTML = "";
  reviews.forEach((rev) => {
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

// Quantity Controls
const decreaseQty = document.getElementById("decreaseQty")
const increaseQty = document.getElementById("increaseQty")
const quantity = document.getElementById("quantity")

decreaseQty.addEventListener("click",function(){
  let q = Number(quantity.textContent)
  q = Math.max(q - 1, 1);
  quantity.textContent = q;
  quantity.textContent = q
})

increaseQty.addEventListener("click",function(){
  let q = Number(quantity.textContent)
  quantity.textContent = q + 1;
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







let cart = JSON.parse(localStorage.getItem("cart")) || [];


let shoppingCart = document.querySelector(".cart-items-container");


function createCartItem(Item) {
    return `
    <div class="cart-items" id="${Item.id}">
        <div class="item-image">
            <img src="${Item.img}" alt="">
        </div>

        <div class="item-details">
            <div class="item-name">
                <h4>${Item.name}</h4>
                <p>#${Item.barcode}</p>
            </div>
            <div class="price-quant">
                    <div class="quantity-controls">
                    <button class="decreaseQty">-</button>
                    <span class="quantity">${Item.quantity || 1}</span>
                    <button class="increaseQty">+</button>
                </div>
                <div class="price">
                    
                    <div><p class="item-price">${Item.price}</p></div>
                    <img src="images/Close.png" alt="" class="removeFromCart">
                </div>
            </div>
        </div>
    </div>
    `;
}


cart.forEach(element => {
  
    if (!element.quantity) element.quantity = 1;
    shoppingCart.insertAdjacentHTML("beforeend", createCartItem(element));
});

//===============================================================================
// Order Summary

const orderSummery = document.querySelector(".order-summary");


function updateSummary() {
    let subtotal = 0;

    cart.forEach(item => {
        const priceNum = Math.round(Number(item.price.slice(1)));
        subtotal += priceNum * item.quantity;
    });

    const tax = 50;
    const shipping = 29;
    const total = subtotal + tax + shipping;

    orderSummery.innerHTML = `
        <h2>Order Summary</h2>
        <div>
            <p><strong>Subtotal</strong></p>
            <p>$${subtotal}</p>
        </div>
        <div>
            <p>Estimates Tax</p>
            <p>$${tax}</p>
        </div>
        <div>
            <p>Estimated shipping</p>
            <p>$${shipping}</p>
        </div>
        <div>
            <p><strong>Total</strong></p>
            <p>$${total}</p>
        </div>
        <button class="checkout">Checkout</button>
    `;
}


updateSummary();



// ========================================================================

function updateCartItem(card, item) {
    card.querySelector(".quantity").textContent = item.quantity;
    const unitPrice = Number(item.price.slice(1));
    card.querySelector(".item-price").textContent = `$${Math.round(unitPrice * item.quantity)}`;
}




// Update Price With Quantity Change 

shoppingCart.addEventListener("click", function(e){
    if (e.target.classList.contains('increaseQty') || e.target.classList.contains("decreaseQty")){
        const card = e.target.closest(".cart-items")
        const productId = Number(card.id)
        const item = cart.find(elem => elem.id === productId)

        if (e.target.classList.contains("increaseQty")){
            item.quantity++;
        }
        else if (e.target.classList.contains("decreaseQty")){
            item.quantity = Math.max(item.quantity-1,1)
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        updateCartItem(card,item)
        updateSummary();
    }
});

// ===================================================================================================

// Remove item from cart
shoppingCart.addEventListener("click", function(e) {
    if (e.target && e.target.classList.contains("removeFromCart")) {
        const card = e.target.closest(".cart-items");
        const productId = Number(card.id);

        const index = cart.findIndex(item => item.id === productId);

        if (index > -1) {
            cart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));
        card.remove();
        updateSummary();
        if (cart.length>0){
            cartBadge.style.display = 'inline'
            cartBadge.textContent = cart.length
          }
          else{
            cartBadge.style.display = 'none'
          }
    }
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
//====================================================================

const cartBadge = document.getElementById('cart-badge')

if (cart.length>0){
    cartBadge.style.display = 'inline'
    cartBadge.textContent = cart.length
  }
  else{
    cartBadge.style.display = 'none'
  }

// ======================================================
const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const heartBadge = document.getElementById('heart-badge')
if (favorites.length>0){
    heartBadge.style.display = 'inline'
    heartBadge.textContent = favorites.length
  }
  else{
    heartBadge.style.display = 'none'
  }

  // =============================
// Checkout Modal Logic
// =============================

const modal = document.getElementById("checkoutModal");
const checkoutBtn = document.querySelector(".checkout");
const closeBtn = document.querySelector(".close-btn");
const checkoutForm = document.getElementById("checkoutForm");
const successMessage = document.getElementById("successMessage");

// Open modal on checkout button click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("checkout")) {
    modal.style.display = "flex";
  }
});

// Close modal when clicking X
closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
  successMessage.textContent = "";
  checkoutForm.reset();
});

// Close modal when clicking outside content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    successMessage.textContent = "";
    checkoutForm.reset();
  }
});

// Handle form submission
checkoutForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !address) {
    alert("Please fill in all fields.");
    return;
  }

  // Basic email validation
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) {
    alert("Please enter a valid email.");
    return;
  }

  // Simulate order success
  successMessage.textContent = "✅ Order placed successfully!";
  
  // Clear cart
  localStorage.removeItem("cart");
  cart = [];
  shoppingCart.innerHTML = "";
  updateSummary();
  cartBadge.style.display = "none";

  // Auto-close modal after 2 seconds
  setTimeout(() => {
    modal.style.display = "none";
    checkoutForm.reset();
    successMessage.textContent = "";
  }, 2000);
});

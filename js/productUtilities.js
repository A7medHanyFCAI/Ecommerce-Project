// Create Product Card 

export function createProductCard(product,favorites,cartItems){

    const isFavorited = favorites.some(fav=> fav.id === product.id)
    const inCart = cartItems.some(item=> item.id === product.id)

  
    return `
    <div class="product-card ${isFavorited ? "favorited" : ""}" 
     id="${product.id}" 
     data-barcode="${product.meta? product.meta.barcode: product.barcode}">

      <div class="favourite">
        <img class="favourite-icon" alt="">
      </div>
      <div>
        <img src="${product.images? product.images[0]: product.img}" alt=" " class="product-img">
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
  `
}

// ========================================================================
// Display the Card
export function displayProducts(container,products,favorites,cartItems,limit=4){
    container.innerHTML = ""
    const visible = products.slice(0,limit);
    visible.forEach(prod => {
        container.insertAdjacentHTML("beforeend", createProductCard(prod,favorites,cartItems));
    });
}

//============================================================

// display Badges


export function checkBadge(container,favorites=null, cartItems=null ){
  if (favorites){
    if (favorites.length>0){
      container.style.display = 'inline'
      container.textContent = favorites.length
    }
    else{
      container.style.display = 'none'
    }
  }
  else if (cartItems){
    if (cartItems.length>0){
      container.style.display = 'inline'
      container.textContent = cartItems.length
    }
    else{
      container.style.display = 'none'
    }
  }
}

//=========================================================
// Add To Favorites
export function toggleFavorite(e, container,favorites, removeCard=false){
  if (e.target && e.target.classList.contains("favourite-icon")){
    const card = e.target.closest(".product-card");
    const productId = Number(card.id);
    const index = favorites.findIndex(fav => fav.id === productId)

    if (index === -1){
      const img = card.querySelector(".product-img").src;
      const name = card.querySelector(".product-name").textContent;
      const price = card.querySelector(".product-price").textContent.slice(1);
      const barcode = card.dataset.barcode

      favorites.push({id:productId , img:img, title:name, price: price, barcode:barcode});
      card.classList.add("favorited")
    } else {
      favorites.splice(index, 1);
      card.classList.remove("favorited")
    }
    checkBadge(container,favorites)
    localStorage.setItem("favorites", JSON.stringify(favorites))
    if (removeCard){
      card.remove()
    }
  }

}

//==============================================================
// Add to Cart

export function buyProduct(e,container,cartItems){
  if (e.target && e.target.classList.contains("buy")){
    const card = e.target.closest(".product-card")
    const productId = Number(card.id)

    const img = card.querySelector(".product-img").src;
    const name = card.querySelector(".product-name").textContent;
    const price = card.querySelector(".product-price").textContent.slice(1);
    const barcode = card.dataset.barcode
    cartItems.push({ id: productId, img, name, price, quantity: 1, barcode:barcode });
    localStorage.setItem("cart", JSON.stringify(cartItems));  
    e.target.textContent = "Item in Cart";
    e.target.disabled = true;

    checkBadge(container,null,cartItems)

  }
}


//=============================================================
// Open Product details

export function openProductDetail(e){
  if (e.target && e.target.classList.contains("product-img")){
    const card = e.target.closest(".product-card")
    const productId = Number(card.id)
    window.location.href = `product-details.html?id=${productId}`
  }
}
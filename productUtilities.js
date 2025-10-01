

const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

export function createProductCard(product){
    const isFavorited = favorites.some(fav=> fav.id === product.id)
    const inCart = cartItems.some(item=> item.id === product.id)

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
  `
}

export function displayProducts(container,products,limit=4){
    container.innerHTML = ""
    const visible = products.slice(0,limit);
    visible.forEach(prod => {
        container.insertAdjacentHTML("beforeend", createProductCard(prod));
    });
}






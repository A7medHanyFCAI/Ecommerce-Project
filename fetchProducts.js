let allProducts = [];

export async function fetchProducts() {
    let response = await fetch("https://dummyjson.com/products?limit=194");
    let data = await response.json();
    allProducts = data.products;
  
    return allProducts
}


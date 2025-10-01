export const categories = [
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



export function getCategoryCount() {
  if (window.innerWidth <= 480) return 1;
  if (window.innerWidth <= 768) return 2;
  if (window.innerWidth <= 1024) return 4;
  return 6; 
}

export function resize(start,count,categoriesContainer){
    count = getCategoryCount();
    displayCategories(start, count,categoriesContainer);
    return count
}


export function displayCategories(start, count,categoriesContainer) {
    categoriesContainer.innerHTML = "";
    const visible = [];
    for (let i = 0; i < count; i++) {
        const index = (start + i) % categories.length;
        visible.push(categories[index]);
    }

    visible.forEach(cat=>{
        let card = `
        <div class="category-card">
            <img src="${cat.image}" alt="" class="category">
            <p class="category">${cat.title}</p>
        </div>`;
        
        categoriesContainer.insertAdjacentHTML('beforeend', card);
    })
}


export function nextBtnFun(start,count,categoriesContainer){
    start = (start + 1) % categories.length;
    displayCategories(start, count,categoriesContainer);
    return start;
}


export function prevBtnFun(start,count,categoriesContainer){
    start = (start - 1 + categories.length) % categories.length;
    displayCategories(start, count,categoriesContainer);
    return start;
}


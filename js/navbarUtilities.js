// Highlight active link 
const shop = document.querySelectorAll(".shop")
const navLinks = document.querySelector(".nav-links")
const anchors = navLinks.querySelectorAll(".nav-link");

const currentPage = window.location.pathname.split("/").pop()

export function highlightActiveLink(){
    anchors.forEach(link => {
        if (link.getAttribute('href') === currentPage){
            link.classList.add("active")
        }
        else{
            link.classList.remove("active")
        }
    })
}

// ========================================================================
// open products page

export function openProductsPage(){
    shop.forEach(btn=>{
        btn.addEventListener('click', ()=> window.location.href = `products.html`)
    })
}
// ========================================================================
// hamburger menu

const hamburger = document.querySelector(".hamburger")
const navLinksContainer = document.querySelector(".nav-links")

export function toggleHamburger(){
    
    hamburger.addEventListener("click", () => {
        navLinksContainer.classList.toggle("open");
        hamburger.classList.toggle("active");
      });
}
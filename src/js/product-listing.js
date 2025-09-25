import ExternalServices from "./ExternalServices.mjs";
import ProductList from "./ProductList.mjs";
import { getParam, loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const category    = getParam("category");
const dataSource  = new ExternalServices();
const listElement = document.querySelector(".product-list");
const searchInput = document.getElementById("searchInput");
const resetBtn    = document.getElementById("resetSearch");
const productList = new ProductList(category, dataSource, listElement);


async function loadProducts(searchQuery = "") {
    const allProducts = await dataSource.getData(category);
    let filteredProducts = allProducts;
    if (searchQuery) {
        const queryLower = searchQuery.toLowerCase();
        filteredProducts = allProducts.filter(
            p =>
                p.NameWithoutBrand.toLowerCase().includes(queryLower) ||
                (p.Brand?.Name.toLowerCase().includes(queryLower))
        );

        if (filteredProducts.length === 0) {
            listElement.innerHTML = "<p>No products match your search.</p>";
        }

        document.querySelector(".title").textContent = `Search results in "${category}" for "${searchQuery}"`;
    } else {
        document.querySelector(".title").textContent = category;
    }

    // Update ProductList instance
    productList.originalProducts = filteredProducts;
    productList.renderList(filteredProducts);
}

// Initialize page
loadProducts(getParam("search") || "");

// Search form
document.getElementById("searchForm")?.addEventListener("submit", (e) => {
    e.preventDefault();
    loadProducts(searchInput.value.trim());
});

// Reset button
resetBtn?.addEventListener("click", () => {
    searchInput.value = "";
    loadProducts();
});






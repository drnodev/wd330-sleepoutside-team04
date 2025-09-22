import { renderListWithTemplate } from "./utils.mjs";

class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
    }

    async init() {
        const list          = await this.dataSource.getData(this.category);
        document.querySelector(".title").textContent = this.category;
        this.renderList(list); 
    }


    renderList(list) {
       renderListWithTemplate(this.productCardTemplate, this.listElement, list);
    }


    productCardTemplate(product) {
        return `
          <li class="product-card">
            <a href="product_pages/?product=${product.Id}">
                <img 
                src="${product.Image}" 
                alt="${product.NameWithoutBrand}">
                <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
                <h2 class="card__name">${product.NameWithoutBrand}</h2>
                <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
            </a>
          </li>`
    }
}

export default ProductList;
import { renderListWithTemplate } from "./utils.mjs";

class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = []; //Keeping fetched products here -- BN
        this.originalProducts = []; // full list or search results
        this.buttonsCreated = false; // track if buttons were created
    }

    async init() {
        this.products = await this.dataSource.getData(this.category); //storing the empty array "this.products"
        document.querySelector(".title").textContent = this.category;
        this.renderList(this.products); // Now render from this.products
        this.addButtons();
    }


    renderList(list) {
        this.products = list; // update current products
        this.listElement.innerHTML = ""; // clear previous items
        renderListWithTemplate(this.productCardTemplate, this.listElement, list);

        if (!this.buttonsCreated) {
            this.addButtons(); // create buttons only once
            this.buttonsCreated = true;
        }
    }


    productCardTemplate(product) {
        return `
          <li class="product-card">
            <a href="/product_pages/?product=${product.Id}">
                <img 
                src="${product.Images.PrimaryMedium}" 
                alt="${product.NameWithoutBrand}">
                <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
                <h2 class="card__name">${product.NameWithoutBrand}</h2>
                <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
            </a>
          </li>`
    }

    //BN--Adding the ability to sort by price:
    addButtons() {
        const container = document.createElement('div');
        container.id = 'sort-container';
        
        const unsortedBtn = document.createElement('button');
        unsortedBtn.textContent = 'Unfiltered';
        unsortedBtn.addEventListener('click', () => {
            this.renderList(this.originalProducts);
        });

        const ascendBtn = document.createElement('button');
        ascendBtn.textContent = 'Low to High';
        ascendBtn.addEventListener('click', () =>{
            const sorted = [...this.products].sort((a,b) => a.FinalPrice - b.FinalPrice);
            this.renderList(sorted);
        });

        const descendBtn = document.createElement('button');
        descendBtn.textContent = 'High to Low';
        descendBtn.addEventListener('click', () =>{
            const sorted = [...this.products].sort((a,b) => b.FinalPrice - a.FinalPrice);
            this.renderList(sorted);
        });

        container.appendChild(unsortedBtn);
        container.appendChild(ascendBtn);
        container.appendChild(descendBtn)
        this.listElement.before(container);
    }
}

export default ProductList;
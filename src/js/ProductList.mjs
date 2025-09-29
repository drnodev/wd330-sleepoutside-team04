import { renderListWithTemplate } from "./utils.mjs";

class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement = listElement;
        this.products = []; //Keeping fetched products here -- BN
        this.originalProducts = []; // full list or search results
        this.buttonsCreated = false; // track if buttons were created

        // Create single dialog for the entire app
        this.createSharedDialog();
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
        this.addModal(); // Add modal events after rendering

        if (!this.buttonsCreated) {
            this.addButtons(); // create buttons only once
            this.buttonsCreated = true;
        }
    }

    //BN-- Added a quick view button. When clicked it should show a modal with the product details in it.
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
            <button type="button" class="openButton" data-product-id="${product.Id}">Quick View</button>
          </li>
          `
    }

    createSharedDialog() {
        // Create single dialog element and append to body
        const dialog = document.createElement('dialog');
        dialog.className = 'shared-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <button type="button" class="closeButton">Close</button>
                <div class="dialog-body"></div>
            </div>
        `;
        document.body.appendChild(dialog);
        this.sharedDialog = dialog;
        
        // Add close event
        dialog.querySelector('.closeButton').addEventListener('click', () => {
            dialog.close();
        });
    }

    addModal(){
        const openButtons = this.listElement.querySelectorAll('.openButton');
        openButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const productId = e.target.dataset.productId;
                const product = this.products.find(p => p.Id === productId);
                
                if (product && this.sharedDialog) {
                    this.populateDialog(product);
                    this.sharedDialog.showModal();
                }
            });
        });
  
    }

    populateDialog(product) {
        const dialogBody = this.sharedDialog.querySelector('.dialog-body');
        dialogBody.innerHTML = `
            <h2>${product.NameWithoutBrand}</h2>
            <img src="${product.Images.PrimaryLarge || product.Images.PrimaryMedium}" 
                 alt="${product.NameWithoutBrand}">
            <h3 class="card__brand">${product.Brand?.Name || ""}</h3>
            <p class="product-card__price">$${product.FinalPrice.toFixed(2)}</p>
            <div class="product-description">
                ${product.DescriptionHtmlSimple || 'No description available'}
            </div>
            <a href="/product_pages/?product=${product.Id}" class="view-details-btn">
                View Full Details
            </a>
        `;
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
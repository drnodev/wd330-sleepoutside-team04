import { CARTKEY, getLocalStorage, setLocalStorage, updateCartBadge } from "./utils.mjs";


export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {

        this.product = await this.dataSource.findProductById(this.productId)
        document.querySelector('.product-detail').innerHTML = this.renderProductDetails()



        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        // the product details are needed before rendering the HTML
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing.
        // Review the readings from this week on 'this' to understand why.
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));

        //updateCartBadge();
    }


    addProductToCart() {
        const cart = getLocalStorage(CARTKEY) || [];
        const existingProduct = cart.find(item => item.Id === this.product.Id);

        if (existingProduct) {
            existingProduct.qty += 1;
        } else {
            const productWithId = {
                ...this.product,
                qty: 1,
            };
            cart.push(productWithId);
        }

        setLocalStorage(CARTKEY, cart);
        updateCartBadge();
    }


    renderProductDetails() {
        const colorshtml = this.product.Colors.map(c => c.ColorName).join(', ');


        return `
            <h3>${this.product.Brand?.Name || ""}</h3>
            <h2 class="divider">${this.product.NameWithoutBrand}</h2>
            <img
                class="divider"
                src="${this.product.Images.PrimaryLarge}"
                alt="${this.product.NameWithoutBrand}"
            />

            <p class="product-card__price">$${this.product.ListPrice.toFixed(2)}</p>
            <p class="product__color">${colorshtml}</p>
            <p class="product__description">${this.product.DescriptionHtmlSimple}</p>

            <div class="product-detail__add">
                <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
            </div>
        `;
    }
}
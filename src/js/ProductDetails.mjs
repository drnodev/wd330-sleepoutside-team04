import { alertMessage, CARTKEY, getLocalStorage, removeAllAlerts, setLocalStorage, updateCartBadge } from "./utils.mjs";


export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
        this.selectedColor = null; 
    }

    async init() {

        this.product = await this.dataSource.findProductById(this.productId)
        if (this.product.Colors && this.product.Colors.length > 0) {
            this.selectedColor = this.product.Colors[0];
        }
        document.querySelector('.product-detail').innerHTML = this.renderProductDetails()

        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        // the product details are needed before rendering the HTML
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing.
        // Review the readings from this week on 'this' to understand why.
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));

        //updateCartBadge();
        this.attachSwatchListeners();

    }


    addProductToCart() {
        const cart = getLocalStorage(CARTKEY) || [];
        const existingProduct = cart.find(item => item.Id === this.product.Id && item.selectedColor.ColorName === this.selectedColor.ColorName);

        if (existingProduct) {
            existingProduct.qty += 1;
        } else {
            const productWithId = {
                ...this.product,
                qty: 1,
                selectedColor: this.selectedColor,
            };
            cart.push(productWithId);
        }

        setLocalStorage(CARTKEY, cart);
        updateCartBadge();
        removeAllAlerts();
        alertMessage('Product added to cart',true, 'success', 3000);

        const cartIcon = document.querySelector(".cart");
        if (cartIcon) {
            const animationClass = 'animate-pop';
            cartIcon.classList.add(animationClass);
            setTimeout(() => {
                cartIcon.classList.remove(animationClass);
            }, 500);
        }
    }


    renderProductDetails() {
        
    const colorSwatchHTML = this.product.Colors.map(c => `
        <span 
            class="color-swatch" 
            style="background-image: url('${c.ColorPreviewImageSrc}');"
            data-color-data='${JSON.stringify(c)}'
            title="${c.ColorName}">
        </span>
    `).join('');

    const colorshtml = this.product.Colors.length > 1 
        ? `<div class="color-swatches-container">${colorSwatchHTML}</div>` 
        : `<p class="product__color-name">${this.product.Colors[0]?.ColorName || ""}</p>`;

    return `
        <h3>${this.product.Brand?.Name || ""}</h3>
        <h2 class="divider">${this.product.NameWithoutBrand}</h2>
        <img
            class="divider"
            src="${this.product.Images.PrimaryLarge}"
            alt="${this.product.NameWithoutBrand}"
        />

        <p class="product-card__price">$${this.product.ListPrice.toFixed(2)}</p>
        <div class="product__color">${colorshtml}</div>
        <p class="product__description">${this.product.DescriptionHtmlSimple}</p>

        <div class="product-detail__add">
            <button id="addToCart" data-id="${this.product.Id}">Add to Cart</button>
        </div>
    `;
}
attachSwatchListeners() {
        const swatches = document.querySelectorAll(".color-swatch");
    
        if (swatches.length === 0) return;

        const initialSelectedSwatch = document.querySelector(`.color-swatch[data-color-name="${this.selectedColor.ColorName}"]`);
        if (initialSelectedSwatch) {
            initialSelectedSwatch.classList.add('selected');
        }

        swatches.forEach(swatch => {
            swatch.addEventListener('click', () => {
                console.log('Swatch clicked');
                const colorDataString = swatch.getAttribute('data-color-data');
                const selectedColorData = JSON.parse(colorDataString);
                
                console.log('Selected color data:', selectedColorData);

                this.selectedColor = selectedColorData;
                swatches.forEach(s => s.classList.remove('selected'));
                swatch.classList.add('selected');
            });
        });
    }

}
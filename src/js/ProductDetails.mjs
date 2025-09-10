import { CARTKEY, getLocalStorage, setLocalStorage } from "./utils.mjs";


export default class ProductDetails {

    constructor(productId, dataSource) {
        this.productId = productId;
        this.product = {};
        this.dataSource = dataSource;
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId)
        console.log(this.product)

        this.renderProductDetails()



        // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
        // the product details are needed before rendering the HTML
        // once the HTML is rendered, add a listener to the Add to Cart button
        // Notice the .bind(this). This callback will not work if the bind(this) is missing.
        // Review the readings from this week on 'this' to understand why.
        document.getElementById('addToCart')
            .addEventListener('click', this.addProductToCart.bind(this));


    }


    addProductToCart() {
        const cart = getLocalStorage(CARTKEY) || []
        cart.push(this.product)
        setLocalStorage(CARTKEY, cart);
    }


    renderProductDetails() {
        const title = document.querySelector(".product-detail h2")
        title.innerHTML = this.product.NameWithoutBrand

        const brand = document.querySelector(".product-detail h3")
        brand.innerHTML = this.product.Brand.Name

        const image = document.querySelector(".product-detail img")
        image.src = this.product.Image

        const price = document.querySelector('.product-card__price')
        price.innerHTML = this.product.ListPrice

        const color = document.querySelector('.product__color')

        const colorshtml = this.product.Colors.map(color => color.ColorName).join(',')
        color.innerHTML = colorshtml

        const description = document.querySelector('.product__description')
        description.innerHTML = this.product.DescriptionHtmlSimple

    }
}
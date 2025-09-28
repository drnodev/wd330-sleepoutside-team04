import { getLocalStorage, formDataToJSON, removeAllAlerts,alertMessage  } from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();


export default class CheckoutProcess {
    constructor(key, outputSelector) {
        this.key = key ?? 'so-cart';
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.shipping = 10.0;
        this.tax = 0.06;
        this.orderTotal = 0;
    }

    init() {
        this.list = getLocalStorage(this.key);
        this.calculateItemSummary();
    }

    calculateItemSubTotal() {
        // calculate and display the total dollar amount of the items in the cart, and the number of items.
        const subtotal = document.querySelector(`#summary-subtotal`);
        const cartItems = getLocalStorage(this.key) || [];
        if (cartItems.length > 0) {
            let totalAmount = 0;
            for (const item of cartItems) {
                totalAmount += (item.FinalPrice * (item.qty || 1));
            }
            this.itemTotal = totalAmount;
            subtotal.innerText = `$${this.itemTotal.toFixed(2)}`;
        }
    }

    calculateOrderTotal() {
        // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
        this.tax = (this.itemTotal * this.tax);
        this.shipping = this.list.length > 1 ? this.shipping + (2 * (this.list.length -1)) : this.shipping;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        // display the totals.
        this.displayOrderTotals();
    }

    calculateItemSummary() {
        this.calculateItemSubTotal();
        this.calculateOrderTotal();
    }

    displayOrderTotals() {
        // once the totals are all calculated display them in the order summary page
        const tax = document.querySelector(`#summary-tax`);
        tax.innerText = `$${this.tax.toFixed(2)}`;

        const shipping = document.querySelector(`#summary-shipping`);
        shipping.innerText = `$${this.shipping.toFixed(2)}`;

        const orderTotal = document.querySelector(`#summary-total`);
        orderTotal.innerText = `$${this.orderTotal.toFixed(2)}`;

    }

    packageItems(items) {
        return items.map(item => ({
            id: item.ProductId,
            name: item.Name,
            price: item.FinalPrice,
            quantity: item.qty || 1
        }));
    }


    async checkout(form) {
        const formAsJson     = formDataToJSON(form);
        formAsJson.orderDate = new Date().toISOString();
        formAsJson.items     = this.packageItems(this.list);
        formAsJson.orderTotal= this.orderTotal;
        this.shipping = this.shipping;
        this.tax = this.tax;        

         try {
            const response = await services.checkout(formAsJson);
            setLocalStorage(this.key, []);
            location.assign("/checkout/success.html");
        } catch (err) {
            removeAllAlerts();
            for (let message in err.message) {
                alertMessage(err.message[message]);
            }
        }
    }
}
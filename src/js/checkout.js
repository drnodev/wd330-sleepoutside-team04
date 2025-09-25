import { loadHeaderFooter } from "./utils.mjs";
import  CheckoutProcess  from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess();
checkout.init();


document.getElementById("checkoutForm").addEventListener("submit", function (e) {
        console.log("submit event");
          e.preventDefault();
            
            checkout.checkout(this);
        
      });


loadHeaderFooter();


import { loadHeaderFooter } from "./utils.mjs";
import  CheckoutProcess  from "./CheckoutProcess.mjs";

const checkout = new CheckoutProcess();
checkout.init();


document.getElementById("checkoutForm").addEventListener("submit",  (e) => {
              e.preventDefault();
              const form = e.target;
              const status =  form.checkValidity();
              form.reportValidity();
              if (!status) return;
              if(status) {
                  checkout.checkout(form);
              }
      });


loadHeaderFooter();


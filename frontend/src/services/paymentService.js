import { API, ServerURL } from "../utils";
import { getHeaders } from "../utils";


export default class PaymentService {
    constructor() {
        this.client = API;
    }
    createPaymentIntent = ({ cart, callbackSuccess, callbackError }) => {
        API.post( `${ServerURL}api/payments/payment-intents?id=${cart}`, callbackSuccess, callbackError )
        .then(callbackSuccess)
        .catch(callbackError);
    }

    pay = ({ body, callbackSuccess, callbackError }) => {
        const requestInfo = { url: `${ServerURL}api/payments/checkout`, body, config: getHeaders(), callbackSuccess, callbackError }
       API.post(requestInfo)
       .then(callbackSuccess)
        .catch(callbackError);
    }
}
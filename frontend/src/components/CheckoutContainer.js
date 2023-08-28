import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import CartContainer from "./CartContainer";
import Checkout from "./Checkout"
import PaymentService from '../services/paymentService';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);

const CheckoutContainer = () => {
    const {cartID} = useUser()
    const [cart, setCart] = useState();
    const [clientSecret,setClientSecret] = useState(null);
    const MySwal = withReactContent(Swal)


    useEffect(() => {
        const getClientSecret = async () => {
            const service = new PaymentService();
            service.createPaymentIntent({cart,callbackSuccess:callbackSuccessPaymentIntent,callbackError:callbackErrorPaymentIntent})
        }
        cart&&getClientSecret();
    }, [cart])

    const callbackSuccessPaymentIntent = (res) =>{
        setClientSecret(res.data.payload.client_secret)
    }

    const callbackErrorPaymentIntent = err => {
        if(err.response.status == 400) {
            MySwal.fire({
                title: <strong>Oops!</strong>,
                html: <p>No hay suficientes productos disponibles como para que los compres. Mil disculpas.</p>,
              })  
        } else {
            MySwal.fire({
                title: <strong>Oops!</strong>,
                html: <p>Hubo un error de nuestra parte. Por favor inténtalo nuevamente.</p>,
              })  
        }
    }

    const handleCheckout = async () => {
       setCart(cartID)
    }

    return (
        <div className="checkout">
           <h2> checkout</h2>
            <div className="checkout__container"> 
            <CartContainer />
           <div className="checkout__pay">
           {!clientSecret||!stripePromise ? <button onClick={handleCheckout}>
                Finalizar compra
            </button> : <Elements stripe={stripePromise} options={{clientSecret:clientSecret}}>
                    <Checkout/>
                </Elements>}
           </div>
            </div>
        
           
        </div>
    )
}

export default CheckoutContainer;
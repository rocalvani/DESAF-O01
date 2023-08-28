import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useUser } from '../context/UserContext';

const Checkout = () => {
    const stripe = useStripe()
    const elements = useElements()

    const {cartID} = useUser()

    const handleSubmit = async (e) => {
        e.preventDefault()
            const {error, paymentIntent} = await stripe.confirmPayment({
                elements,
                redirect: 'if_required'
            }) 
            if (!error) {
                window.location.replace(`${cartID}/purchase`)
            } 
        
    }

    return (
        <div className="checkout__stripe">
        <form>
            <PaymentElement />
            <button onClick={handleSubmit}>Comprar</button>
        </form>
        </div>
    )
}

export default Checkout;
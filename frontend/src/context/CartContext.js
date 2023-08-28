import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { useUser } from "./UserContext";
import {API, ServerURL} from '../utils.js'
import { toast } from "react-toastify";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const CartContext = createContext()
const Provider = CartContext.Provider

const MySwal = withReactContent(Swal)


export const useCart = () => {
    const values = useContext(CartContext)
    return values;
}

const CartProvider = ({children}) => {

    const stored = JSON.parse(localStorage.getItem('cartList')) ?? [];
    const [cart, setCart] = useState(stored)
    const [quantity, setQuantity] = useState(0)

    const {cartID, logged} = useUser()

    useEffect(() => {
       if (logged) {
        const getOnline = async () => {
            await getCart(cartID)
           }
           getOnline()
       }
    }, [cart])

    const getCart = async (cid) => {
        try { 
          let response = await API(ServerURL+"checkout/"+cid);

            let products = response.data.products
            let quantity = products.reduce(
                (prev, curr) => {
                    return prev + curr.quantity
                } , 0
            )

            setCart(response.data.products);
            setQuantity(quantity)
            

        } catch (error) {
          if(error.response.status === 404) {
            MySwal.fire({
                title: <strong>Oops!</strong>,
                html: <p>Este carrito no existe.</p>,
              })  
          }
        }
      };

      const addToCart = async(uid, pid) =>{
try { 
    let response = await API.post(`${ServerURL}api/carts/${uid}/product/${pid}`)
    if (response.status === 201) {
        let products = response.data.cart.products
            let quantity = products.reduce(
                (prev, curr) => {
                    return prev + curr.quantity
                } , 0
            )

            setCart(response.data.products);
            setQuantity(quantity)
            toast("Tu producto ya te espera en el carrito", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
              });    }

} catch (error) {
    if (error.response.status === 403) {
        toast("Te pedimos disculpas, en este momento no tenemos más unidades disponibles.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });    }
    
}      }
    

    const values = {
        cart: cart,
        getCart: getCart,
        quantity: quantity,
        addToCart: addToCart,
    }

    return (
        <Provider value={values}>
            {children}
        </Provider>
    )
}

export default CartProvider
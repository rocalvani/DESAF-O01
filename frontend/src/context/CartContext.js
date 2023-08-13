import { createContext, useContext, useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { useUser } from "./UserContext";
import {API, ServerURL} from '../utils.js'


const secure = window.location.protocol === 'https'

const CartContext = createContext()
const Provider = CartContext.Provider

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
          console.error(error)
        }
      };

      const addToCart = async(uid, pid) =>{
try { 
    let response = await API.post(`${ServerURL}api/carts/${uid}/product/${pid}`)
    if (response.status === 201) {
        let products = response.data.products
            let quantity = products.reduce(
                (prev, curr) => {
                    return prev + curr.quantity
                } , 0
            )

            setCart(response.data.products);
            setQuantity(quantity)
    }

} catch (error) {
    if (error.response.status === 403) {
        alert("No tienes permisos para sumar este producto a tu carrito.")
    }
    
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
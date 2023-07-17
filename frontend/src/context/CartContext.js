import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from 'react-cookie';
import { useUser } from "./UserContext";
import {ServerURL} from '../utils.js'


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

    const getCart = async (cid) => {
        try { 
          let response = await axios(ServerURL+"checkout/"+cid);

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
    

    const values = {
        cart: cart,
        getCart: getCart,
        quantity: quantity
    }

    return (
        <Provider value={values}>
            {children}
        </Provider>
    )
}

export default CartProvider
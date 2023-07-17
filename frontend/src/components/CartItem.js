import axios from 'axios'
import { ServerURL } from "../utils";
import { useUser } from '../context/UserContext.js';
import { useState } from 'react';


const CartItem = (el) => {

    const {cartID} = useUser()

    const deleteProduct = async () => {
        let result = await axios.delete(`${ServerURL}api/carts/${cartID}/product/${el.product._id}`)
        console.log(result.data)
    }

    const updateQuantity = async (e) => {
        let result = await axios.put(`${ServerURL}api/carts/${cartID}/product/${el.product._id}`, 
        JSON.stringify({quantity: e.target.value}),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        console.log(result.data)
    }

    return (
        <div className="main__login">
            nombre:
            {el.product.title}
            cantidad: 
            <input name="quantity" placeholder={el.product.quantity} onChange={updateQuantity}/>
            <button onClick={deleteProduct} >borrar</button>
        </div>
    )
}

export default CartItem
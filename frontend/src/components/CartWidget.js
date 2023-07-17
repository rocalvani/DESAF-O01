import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CartWidget = () => {

    const {cartID, logged} = useUser()
    const {getCart, quantity} = useCart()


 useEffect(()=>{
  if (logged) {
    const get = async () =>{
        await getCart(cartID)}
        get()
  }
   }, [logged])

    return (
        <div>
        {quantity > 0 ? quantity : ""}
            <NavLink to={"checkout/" + cartID}>link a carro</NavLink>
        </div>
    )
}

export default CartWidget
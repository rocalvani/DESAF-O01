import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext"
import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping } from '@fortawesome/free-solid-svg-icons'

const CartWidget = () => {

    const {cartID, logged} = useUser()
    const {getCart, quantity} = useCart()
    
    const [loaded, setLoaded] = useState(false)


 useEffect(()=>{
  if (logged) {
    const get = async () =>{
        await getCart(cartID)
    await setLoaded(true)}
        get()
  }
   }, [quantity])

   if (loaded) {
    return (
        <div className="header__widget">
        <div className="header__widget--quantity">{quantity > 0 ? quantity : ""}</div>
            <NavLink to={"checkout/" + cartID}><FontAwesomeIcon icon={faCartShopping} /></NavLink>
        </div>
    )
   }
   
}

export default CartWidget
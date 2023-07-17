import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartItem from "./CartItem";
import { useCart } from "../context/CartContext";
import { ServerURL } from "../utils";
import { Link } from "react-router-dom";


const CartContainer =  () =>{
    const params = useParams();
    const [loaded, setLoaded] = useState(false)

    const {getCart, cart} = useCart()


 useEffect(()=>{
  setLoaded(false)
   const get = async () =>{
    await getCart(params.cid)}
    get()
    setLoaded(true)
   }, [cart])

   const purchase = async () => {
     let result = await axios.post(ServerURL+ "checkout/" + params.cid + "/purchase")
     console.log(result.data)
   }


    return (
        <div>
          {loaded ? cart.map((el) => { return <CartItem product={el} key={el._id} />;}) : "loading"}

          <Link to={ServerURL+ "checkout/" + params.cid + "/purchase"}><button onClick={purchase}>finalizar compra</button>
          </Link> 
        </div>
    )
}

export default CartContainer
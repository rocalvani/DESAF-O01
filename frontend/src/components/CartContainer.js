import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartItem from "./CartItem";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/checkout/";

const CartContainer =  () =>{
    const params = useParams();
    const [cart, setCart] = useState({});
    const [loaded, setLoaded] = useState(false)


 useEffect(()=>{
    const getCart = async () => {
      try { 
        let response = await axios(URL + params.cid);
        setCart(response.data.products);
        setLoaded(true)
      } catch (error) {
        console.error(error)
      }
    };
    getCart();
   }, [cart])


    return (
        <div>
          {loaded ? cart.map((el) => { return <CartItem product={el} key={el._id} />;}) : "loading"}
        </div>
    )
}

export default CartContainer
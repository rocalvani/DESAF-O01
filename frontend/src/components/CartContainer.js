import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CartItem from "./CartItem";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/checkout";

const CartContainer = () =>{
    const params = useParams();
    const [cart, setCart] = useState({});


    const getShop = async () => {
        try { 
          let response = await axios(URL + params.pid);
          setCart(response.data);
        } catch (error) {
          console.error(error)
        }
      };
      getShop();

    return (
        <div>
            {cart.map((el) => {
        return <CartItem/>;
      })}
        </div>
    )
}

export default CartContainer
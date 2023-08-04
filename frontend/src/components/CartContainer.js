import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CartItem from "./CartItem";
import { useCart } from "../context/CartContext";
import { API, ServerURL } from "../utils";



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
     let result = await API.post(ServerURL+ "checkout/" + params.cid + "/purchase")
     if (result.status === 201) {
      window.location.replace("/login/checkout/" + params.cid + "/purchase/" + result.data.code);
     } 
     else if (result.status === 400) {
      alert(result.data.msg)
     }
    

   }

   const empty = async () =>{
    try {
      let result = await API.delete(ServerURL+ "api/carts/" + params.cid)
    } catch (error) {
      alert("Hubo un error de nuestra parte. Vuelve a intentar en un momento.")
    }
   }

   const deleteProduct = async (pid) => {
    let result = await API.delete(`${ServerURL}api/carts/${params.cid}/product/${pid}`)
}


    return (
        <div>
          {loaded ? cart.map((el) => { return <CartItem product={el} key={el._id}  deleteProduct={deleteProduct}/>;}) : "loading"}

          <button onClick={purchase}>finalizar compra</button>
          <button onClick={empty}>vaciar</button>
         
        </div>
    )
}

export default CartContainer
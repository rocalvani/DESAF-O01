import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CartItem from "./CartItem";
import { useCart } from "../context/CartContext";
import { API, ServerURL } from "../utils";
import Loader from "./Loader";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'



const CartContainer =  () =>{
    const params = useParams();
    const [loaded, setLoaded] = useState(false)

    const {getCart, cart} = useCart()
    const MySwal = withReactContent(Swal)


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

   const empty = async (e) =>{
    try {
      e.preventDefault()
      let result = await API.delete(ServerURL+ "api/carts/" + params.cid)
    } catch (error) {
      MySwal.fire({
        title: <strong>Oops!</strong>,
        html: <p>Hubo un error de nuestra parte. Por favor inténtalo nuevamente.</p>,
      })       }
   }

   const deleteProduct = async (pid) => {
try {
  let result = await API.delete(`${ServerURL}api/carts/${params.cid}/product/${pid}`)
} catch (error) {
  MySwal.fire({
    title: <strong>Oops!</strong>,
    html: <p>Hubo un error de nuestra parte. Por favor inténtalo nuevamente.</p>,
  })  
}}


    if(loaded) {
      return (
        <div className="cart">
          <div className="cart__empty"><button onClick={empty}>vaciar</button></div>
          <div className="cart__container">
          {loaded ? cart.map((el) => { return <CartItem product={el} key={el._id}  deleteProduct={deleteProduct}/>;}) : "loading"}
          </div>
         
        </div>
    )
    } else {
      <Loader/>
    }
}

export default CartContainer
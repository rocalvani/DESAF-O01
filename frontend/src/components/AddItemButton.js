import axios from "axios";
import { useUser } from "../context/UserContext";
import { ServerURL } from "../utils";



const AddItemButton = (props) => {

  const {cartID} = useUser()

      const addToCart = async() =>{

        const API = axios.create({
          baseURL: "http://localhost:8080",
          withCredentials: true,
        });

    let response = await API.post(`${ServerURL}api/carts/${cartID}/product/${props.pid}`)
    let cart = response.data
    console.log(cart)
  }

    return ( 
        <button
            className="item__count--add"
            onClick={addToCart}
          >
            sumar al carrito
          </button>
    )
}

export default AddItemButton;
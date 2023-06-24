
import axios from "axios";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const AddItemButton = (props) => {

      const addToCart = async() =>{
    let response = await axios.post(URL + `api/carts/648245c5193359f980866ec0/product/${props.id}`)
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
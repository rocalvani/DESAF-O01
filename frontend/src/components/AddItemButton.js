import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext";
import { API, ServerURL } from "../utils";
import { Rating } from '@smastrom/react-rating';



const AddItemButton = (props) => {

  const {cartID} = useUser()
  const {addToCart} = useCart()

  const handleAdd =() => {
    addToCart(cartID, props.pid)
  }

    return ( 
        <button
            className="addItem"
            onClick={handleAdd}
          >
           
            sumar al carrito
          </button>
    )
}

export default AddItemButton;
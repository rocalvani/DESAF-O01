
import { API, ServerURL } from "../utils";
import { useUser } from '../context/UserContext.js';



const CartItem = ({deleteProduct, product}) => {
    const {cartID} = useUser()

    const updateQuantity = async (e) => {
        let result = await API.put(`${ServerURL}api/carts/${cartID}/product/${product._id}`, 
        JSON.stringify({quantity: e.target.value}),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        })
        console.log(result.data)
    }

    const handleDelete = () =>{
        deleteProduct(product._id)
    }

    return (
        <div className="cart__item">
            {product.product.title}<br/>
            cantidad: 
            <input name="quantity" placeholder={product.quantity} onChange={updateQuantity}/>
            <button onClick={handleDelete} >borrar</button>
        </div>
    )
}

export default CartItem
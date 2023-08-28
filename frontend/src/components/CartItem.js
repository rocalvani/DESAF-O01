
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
    }

    const handleDelete = () =>{
        deleteProduct(product._id)
    }

    return (
        <div className="cart__item">
            <div className="cart__item--img">
            <img
        alt="hola"
        src={"../img/products/" + product.product.thumbnail[0].img}
        width="100%"
      />
            </div>
            <div className="cart__item--desc"><h3>
                 {product.product.title}</h3>
           <p> ${product.product.price * product.quantity}</p>
</div>
            <div className="cart__item--quantity">
            cantidad: 

            <input name="quantity" placeholder={product.quantity} onChange={updateQuantity}/>

            </div>
            <div className="cart__item--delete">
            <button onClick={handleDelete} >borrar</button>

            </div>
        </div>
    )
}

export default CartItem
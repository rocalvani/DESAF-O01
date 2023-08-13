import {Link} from 'react-router-dom'
import { ServerURL } from '../utils'

const AdminItem = ({product, deleteProduct}) => {

    const handleDelete = () => {
        deleteProduct(product._id)
    }


    return (
<article className="shop__item">
      <p className="tag">{product.category} </p>
      <img alt="hola" src={"../img/products/" + product.thumbnail[0].img} width="100%"/>
            <h3 className="shop__itemTitle">{product.title}</h3>
            <p>${product.price} </p>
            <p>stock: {product.stock}</p>
            <p>status: {product.status ? "true" : "false"}</p>
            <form action={`${ServerURL}api/products/${product._id}?_method=PUT`} method="POST" encType="multipart/form-data">
            <input type="number" placeholder="price" name="price" />
            <input type="number" placeholder="stock" name="stock" />
            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" multiple />
            <input type="text" placeholder="status" name="status" />
            <button type="submit">enviar</button>

            </form>
            <button onClick={handleDelete}>
                borrar
            </button>
            
          
    </article>
    )
}

export default AdminItem
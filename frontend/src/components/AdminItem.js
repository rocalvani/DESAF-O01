import {Link} from 'react-router-dom'

const AdminItem = ({product, deleteProduct}) => {

    const handleDelete = () => {
        deleteProduct(product._id)
    }

    return (
<article className="shop__item">
      <p className="tag">{product.category} </p>
      <img alt="hola" src={"../img/products/" + product.thumbnail[2].img} width="100%"/>
            <h3 className="shop__itemTitle">{product.title}</h3>
            <p>${product.price} </p>
            <Link to={product._id + "/edit"}>edit</Link>
            <button onClick={handleDelete}>
                borrar
            </button>
            
          
    </article>
    )
}

export default AdminItem
import {Link} from 'react-router-dom'
import { API, ServerURL } from '../utils'

const AdminItem = ({product, deleteProduct}) => {

    const handleDelete = () => {
        deleteProduct(product._id)

    }

    const handleUpdate = async (e) => {
        try {
          e.preventDefault();
          let formData = new FormData(document.getElementById(`updateForm${product._id}`));
          console.log(formData)
          const config = {
            headers: { "content-type": "multipart/form-data" },
          };
          let result = await API.post(
            `${ServerURL}api/products/${product._id}?_method=PUT`,
            formData,
            config
          );
         
        } catch (error) {
          console.log(error);
        }
      };


    return (
<article className="settings__item">
<div className="settings__item--img">
<img alt="hola" src={"../img/products/" + product.thumbnail[0].img} width="100%"/></div>
      <div className="settings__item--info">
      <p className="tag">{product.category} </p>

<h4 className="shop__itemTitle">{product.title}</h4>

<p>${product.price} </p>
<p>stock: {product.stock}</p>
<p>status: {product.status ? "true" : "false"}</p>
<p>tags: {product.tags.map((el) => <span key={el.tag}>{el.tag}</span>)}</p>
      </div>
            <div className="settings__item--edit">
            <form id={`updateForm`+product._id} encType="multipart/form-data">
            <input type="number" placeholder="price" name="price" />
            <input type="number" placeholder="stock" name="stock" />
            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" multiple />
            <input type="text" placeholder="status" name="status" />
            <input type="tags" placeholder="tags" name="tags" />

            <button type="submit" onClick={handleUpdate}>enviar</button>

            </form>
            </div>
            <button onClick={handleDelete} className="settings__button">
                borrar
            </button>
            
          
    </article>
    )
}

export default AdminItem
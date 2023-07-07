import { Link } from "react-router-dom";
import AddItemButton from "./AddItemButton";

const Item = ({product}) => {

  return (
    <article className="shop__item">
      <p className="tag">{product.category} </p>
      <img alt="hola" src={"../img/products/" + product.thumbnail[2].img} width="100%"/>
            <h3 className="shop__itemTitle">{product.title}</h3>
            <p>${product.price} </p>
            <Link to={product._id}>ver más</Link>
            <AddItemButton id={product._id} />
            
          
    </article>
  );
};

export default Item;
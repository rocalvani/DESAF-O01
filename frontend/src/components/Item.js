import { Link } from "react-router-dom";
import AddItemButton from "./AddItemButton";

const Item = (props) => {

  return (
    <article className="shop__item">
      <p className="tag">{props.category} </p>
      <img alt="hola" src="https://github.com/rocalvani/DESAFIO01/blob/main/frontend/public/img/uwu/002.png?raw=true" width="100%"/>
            <h3 className="shop__itemTitle">{props.title}</h3>
            <p>${props.price} </p>
            <Link to={props.id}>ver más</Link>
            <AddItemButton id={props.id} />
            
          
    </article>
  );
};

export default Item;
import AddItemButton from "./AddItemButton";

const Item = (props) => {

  return (
    <article className="shop__item">
      <p className="tag">{props.category} </p>
      <img src="https://github.com/rocalvani/DESAFIO01/blob/main/frontend/public/img/uwu/001.png" />
            <h3 className="shop__itemTitle">{props.title}</h3>
            <p>${props.price} </p>
            <AddItemButton id={props.id} />
            
          
    </article>
  );
};

export default Item;
import AddItemButton from "./AddItemButton";

const Item = (props) => {

  return (
    <article className="shop__item">
      <p className="tag">{props.category} </p>
            <h3 className="shop__itemTitle">{props.title}</h3>
            <p>${props.price} </p>
            <AddItemButton id={props.id} />
            
          
    </article>
  );
};

export default Item;
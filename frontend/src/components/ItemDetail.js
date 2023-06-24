import AddItemButton from "./AddItemButton";

const ItemDetail = (props) => {
  return (
    <div className="detail">
      <div className="detail__info">
        <h2>{props.title}</h2>
        <p>${props.price}</p>
        <AddItemButton />
        </div>
      <div className="detail__img">
        <img src="https://github.com/rocalvani/DESAFIO01/blob/main/frontend/public/img/uwu/003.png?raw=true" width="100%"/>
      </div>
      <div className="detail__desc">{props.desc}</div>
    </div>
  );
};

export default ItemDetail;

import AddItemButton from "./AddItemButton";

const ItemDetail = ({product}) => {

  return (
    <div className="detail">
      <div className="detail__info">
        <h2>{product.title}</h2>
        <p>${product.price}</p>
        <AddItemButton pid={product._id}/>
        </div>
      <div className="detail__img">
      <img src={"../img/products/" + product.thumbnail[0].img} />
      </div>
      <div className="detail__desc">{product.description}</div>
    </div>
  );
};

export default ItemDetail;

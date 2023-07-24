import AddItemButton from "./AddItemButton";

const ItemDetail = ({product}) => {

  const tags = product.tags

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
      <div className="detail__desc">
          <p>{product.description}</p>
          {/* {product.tags.map((el) => {
            return (
              <h3>{el}</h3>
            )
          })} */}
        </div>
    </div>
  );
};

export default ItemDetail;

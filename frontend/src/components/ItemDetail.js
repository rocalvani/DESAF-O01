import { useState } from "react";
import AddItemButton from "./AddItemButton";

const ItemDetail = ({product, postComment}) => {

  const [comment, setComment] = useState()

  const tags = product.tags
  const comments = product.comments
 
  const handlePost = (e) => {
    e.preventDefault();
    postComment(comment)
  }

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
          {tags.map((el) => {return <span key={el.tag}>{el.tag}</span>})}
 
 {comments.map((el) => {return <div key={el._id}>{el.comment.comment}</div>})}
          <form>
          <input type="text" onChange={(e) => setComment(e.target.value)}/>
          <button onClick={handlePost}>comentar</button>
        </form>
        </div>
      
    </div>
  );
};

export default ItemDetail;

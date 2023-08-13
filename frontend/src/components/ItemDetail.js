import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import AddItemButton from "./AddItemButton";
import Comment from "./Comment";

import { Rating } from '@smastrom/react-rating';



const ItemDetail = ({ product, postComment, deleteComment }) => {
  const [comment, setComment] = useState();
  const [rating, setRating] = useState(0);
  const [avg, setAvg] = useState(0)

  const tags = product.tags;
  const comments = product.comments;

  useEffect(() => {

    let rates = []
    product.comments.map((el) => {
      rates.push(el.comment.rating)
    } )
    
    let total = rates.reduce((acc, curr) => {
      return acc + curr;
    },0)
    
    setAvg(parseInt(total/rates.length))
      }, [product.comments.length])

  const handlePost = (e) => {
    const star = document.getElementsByClassName("rr--on")
    e.preventDefault();
    postComment({comment: comment, rating: star.length});
    let input = document.getElementById("commentBox");
    input.value = "";
    setRating(0)
  };

  return (
    <div className="detail">
      <div className="detail__info">
        <h2>{product.title}</h2>
        <p>${product.price}</p>
        <Rating
      style={{ maxWidth: 20 }}
      value={avg}
      className="ratingSystem"
      readOnly

    />
        <AddItemButton pid={product._id} />
      </div>
      <div className="detail__img">
        <img src={"../img/products/" + product.thumbnail[0].img} />
      </div>
      <div className="detail__desc">
        <p>{product.description}</p>
        {tags.map((el) => {
          return <span key={el.tag}>{el.tag}</span>;
        })}

        {comments.map((el) => {
          return (
            <Comment key={el._id} comment={el} deleteComment={deleteComment} />
          );
        })}
        <form>
        <Rating
      style={{ maxWidth: 30 }}
      value={rating}
      onChange={setRating}
      className="ratingSystem"
    />
          <input
            type="text"
            id="commentBox"
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handlePost}>comentar</button>
        </form>
      </div>
    </div>
  );
};

export default ItemDetail;

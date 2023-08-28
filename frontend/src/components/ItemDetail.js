import { useEffect, useState } from "react";
import AddItemButton from "./AddItemButton";
import Comment from "./Comment";

import { Rating } from "@smastrom/react-rating";

const ItemDetail = ({ product, postComment, deleteComment }) => {
  const [comment, setComment] = useState();
  const [rating, setRating] = useState(0);
  const [avg, setAvg] = useState(0);

  const tags = product.tags;
  const comments = product.comments;

  useEffect(() => {
    let rates = [];
    product.comments.map((el) => {
      rates.push(el.comment.rating);
    });

    let total = rates.reduce((acc, curr) => {
      return acc + curr;
    }, 0);

    setAvg(parseInt(total / rates.length));
  }, [product.comments.length]);

  const handlePost = (e) => {
    const star = [...document.getElementsByClassName("rr--on")].filter(
      (e) => e.role == "radio"
    );
    e.preventDefault();
    postComment({ comment: comment, rating: star.length });
    let input = document.getElementById("commentBox");
    input.value = "";
    setRating(0);
    setComment();
  };

  return (
    <div className="item">
      <div className="item__descLeft">
        <div className="item__desc--text">
          <h4>
            <Rating
              style={{ maxWidth: 60 }}
              value={avg}
              className="ratingSystem"
              readOnly
            />
          </h4>
          <h2 className="item__title">{product.title} </h2>
          <h3>${product.price}</h3>
          <AddItemButton pid={product._id} />
        </div>
      </div>
      <div className="item__img">
        <img src={"../img/products/" + product.thumbnail[1].img} />
      </div>
      <div className="item__desc">
        <div className="item__descContainer">
        <div className="item__desc--text">
          <h2 className="item__desc--title">descripción</h2>
          <p>{product.description}</p>
        </div>
        <div className="item__desc--tag">
          {tags.map((el) => {
            return <span key={el.tag}>{el.tag}</span>;
          })}
        </div>
        </div>
        <div className="item__commentArea">
        <div className="item__commentContainer">
          {comments.map((el) => {
            return (
              <Comment
                key={el._id}
                comment={el}
                deleteComment={deleteComment}
              />
            );
          })}
        </div>

        <form className="item__form">
          <Rating
            style={{ maxWidth: 100 }}
            value={rating}
            onChange={setRating}
            className="ratingSystem"
          />
          <textarea
            rows="5"
            cols="40"
            id="commentBox"
            onChange={(e) => setComment(e.target.value)}
          />
          <button className="item__button" onClick={handlePost}>comentar</button>
        </form>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;

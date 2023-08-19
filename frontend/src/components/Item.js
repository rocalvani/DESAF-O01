import { Link } from "react-router-dom";
import AddItemButton from "./AddItemButton";
import LikeButton from "./LikeButton";
import { useWish } from "../context/WishContext";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const Item = ({ product }) => {
  const [found, setFound] = useState(false);
  const { wish } = useWish();

  useEffect(() => {
    if (wish) {
      let liked = wish.find((el) => el.product._id === product._id);
      if (liked) {
        setFound(true);
      } else {
        setFound(false)
      }
    }

  }, [wish]);


  return (
    <article className="shop__item">
      <p className="tag">{product.category} </p>
      <img
        alt="hola"
        src={"../img/products/" + product.thumbnail[0].img}
        width="100%"
      />
      <h3 className="shop__itemTitle">{product.title}</h3>
      <p>${product.price} </p>
      <Link to={product._id}>ver más</Link>
      <AddItemButton pid={product._id} />
      {found ? <LikeButton pid={product._id} stat={<FontAwesomeIcon icon={faHeart} style={{color: "#f07575",}} />}/> : <LikeButton pid={product._id} stat={<FontAwesomeIcon icon={faHeart} style={{color: "#cccccc",}} />}/>}
    </article>
  );
};

export default Item;

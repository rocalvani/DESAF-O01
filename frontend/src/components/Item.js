import { Link, useLocation } from "react-router-dom";
import AddItemButton from "./AddItemButton";
import LikeButton from "./LikeButton";
import { useWish } from "../context/WishContext";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'

const Item = ({ product }) => {
  const [found, setFound] = useState(false);
  const { wish } = useWish();

  const location = useLocation()

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

if (location.pathname == "/home") {

  return (
   <article className="shop__item">  <Link to={`../shop/${product._id}`}>
      <div className="shop__img"><img
        alt="hola"
        src={"../img/products/" + product.thumbnail[0].img}
        width="100%"
      /></div>
      {product.stock < 10 ? <div className="shop__stock">últimas unidades</div> : null}
      </Link><div className="shop__info">
        <div className="shop__info--text">
        <h3 className="shop__itemTitle">{product.title}</h3>
      <p>${product.price} </p>
        </div>
        {found ? <LikeButton pid={product._id} stat={<FontAwesomeIcon icon={faHeart} style={{color: "#f07575",}} />}/> : <LikeButton pid={product._id} stat={<FontAwesomeIcon icon={faHeart} style={{color: "#cccccc",}} />}/>}
      </div>
     
      <AddItemButton pid={product._id} />
    </article>
  );
} else {
  return (
    <article className="shop__item"><Link to={`${product._id}`}>
  <div className="shop__img"><img
    alt="hola"
    src={"../img/products/" + product.thumbnail[0].img}
    width="100%"
  /></div>
  {product.stock < 10 ? <div className="shop__stock">últimas unidades</div> : null}
  </Link><div className="shop__info">
    <div className="shop__info--text">
    <h3 className="shop__itemTitle">{product.title}</h3>
  <p>${product.price} </p>
    </div>
    {found ? <LikeButton pid={product._id} stat={<FontAwesomeIcon icon={faHeart} style={{color: "#000000",}} />}/> : <LikeButton pid={product._id} stat={<FontAwesomeIcon icon={faHeart} style={{color: "#cccccc",}} />}/>}
  </div>
 
</article>
  )
}
  
};

export default Item;

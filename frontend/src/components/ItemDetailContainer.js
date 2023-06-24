import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import axios from "axios";
// import LoaderContainer from "./LoaderContainer";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/shop/";

const ItemDetailContainer = () => {
//   const [carga, setCarga] = useState(false);
  const [product, setProduct] = useState({});
  const params = useParams();

  
    const getShop = async () => {
      try { 
        let response = await axios(URL + params.pid);
        setProduct(response.data);
      } catch (error) {
        console.error(error)
      }
    };
    getShop();
 

  return (
    <div className="item">
      {/* {!carga ? (
        <LoaderContainer msg="estás más cerca que nunca" />
      ) : ( */}
        <ItemDetail
          title={product.title}
          price={product.price}
          desc={product.description}
          // thumbnails={product.thumbnail}
        />
      {/* )} */}
    </div>
  );
};

export default ItemDetailContainer;
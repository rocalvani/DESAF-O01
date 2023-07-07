import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import axios from "axios";
// import LoaderContainer from "./LoaderContainer";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/shop/";

const ItemDetailContainer = () => {
  const [carga, setCarga] = useState(false);
  const [product, setProduct] = useState({});
  const params = useParams();

  
   useEffect(() => {
    const getShop = async () => {
      try { 
        let response = await axios(URL + params.pid);
        setProduct(response.data);
        setCarga(true)
      } catch (error) {
        console.error(error)
      }
    };
    getShop();
   }, [product])
 
  return (
    <div className="item">
      
       {!carga ? (
        "cargando"
      ) :   <ItemDetail
      product={product}
    />
      }
  
    </div>
  );
};

export default ItemDetailContainer;
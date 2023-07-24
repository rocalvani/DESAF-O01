import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import { API, ServerURL } from "../utils";
// import LoaderContainer from "./LoaderContainer";


const ItemDetailContainer = () => {
  const [carga, setCarga] = useState(false);
  const [product, setProduct] = useState({});
  const params = useParams();

  
   useEffect(() => {
    const getShop = async () => {
      try { 
        let response = await API(ServerURL + "shop/" + params.pid);
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
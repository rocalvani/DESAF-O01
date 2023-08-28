import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ItemDetail from "./ItemDetail";
import { API, ServerURL } from "../utils";
import Loader from "./Loader";
// import LoaderContainer from "./LoaderContainer";


const ItemDetailContainer = () => {
  const [carga, setCarga] = useState(false);
  const [product, setProduct] = useState({});
  const params = useParams();

  const pid = params.pid
  
   useEffect(() => {
    const getShop = async () => {
      try { 
        let response = await API(ServerURL + "shop/" + pid);
        setProduct(response.data);
        setCarga(true)
      } catch (error) {
        console.error(error)
      }
    };
    getShop();
   }, [product])

   const postComment = async (data) => {
    try {
      let response = await API.post(`${ServerURL}api/comment/${pid}`, 
      data)
    } catch (error) {
      console.error(error)
    }
   }

   const deleteComment = async (id) => {
    try {
      let response = await API.delete(`${ServerURL}api/comment/${pid}/${id}`)
    } catch (error) {
      console.error(error)

    }
   }
 
  return (
    <div className="itemContainer">
      
       {!carga ? (
       <Loader />
      ) :   <ItemDetail
      product={product} postComment={postComment} deleteComment={deleteComment}
    />
      }
  
    </div>
  );
};

export default ItemDetailContainer;
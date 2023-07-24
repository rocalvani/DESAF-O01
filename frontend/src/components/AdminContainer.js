import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import AdminItem from "./AdminItem";

const AdminContainer = () => {

    const [shop, setShop] = useState([]);
    const [load, setLoad] = useState(false)
    
  
    useEffect(() => {
      const getShop = async () => {
        try {
          let response = await API(ServerURL + 'shop/settings/admin');
          
          if (response.data != null) {
            setShop(response.data);
          }
          
          setLoad(true)
        } catch (error) {
          console.error(error)
        }
      };
      getShop();
    }, [shop]);

    const deleteProduct = async (pid) => {
       
        let result = await API.delete(ServerURL + 'api/products/' + pid)
        console.log(result.data)
    }
    

if (load) {
    return (
        <div className="main__login">
            
            {shop.length > 0 ? shop.map((el) => {
        return <AdminItem key={el._id} product={el} deleteProduct={deleteProduct} />;
      }) : null}
            <form action={ServerURL + `api/products`} method="POST">
            <input type="text" placeholder="name" name="title"/>
            <input type="text" placeholder="description" name="description"/>
            <input type="number" placeholder="price" name="price"/>
            <input type="number" placeholder="stock" name="stock"/>
            <input type="text" placeholder="code" name="code"/>
            <input type="text" placeholder="thumb" name="thumbnail"/>
            <input type="text" placeholder="thumb" name="thumbnail2"/>
            <input type="text" placeholder="thumb" name="thumbnail3"/>
            <input type="text" placeholder="status" name="status"/>
            <input type="text" placeholder="category" name="category"/>
            <button type="submit">enviar</button></form>

        </div>
    )
}
}

export default AdminContainer;
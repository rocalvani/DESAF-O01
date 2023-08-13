import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import AdminItem from "./AdminItem";

const AdminContainer = () => {

    const [shop, setShop] = useState([]);
    const [load, setLoad] = useState(false)
    const [users, setUsers] = useState([])
    const [userLoad, setUserLoad] = useState(false)
  
    useEffect(() => {
      getShop();
    }, [shop]);

    useEffect(()=> {
      getUsers()
    }, [users])

    const getShop = async () => {
      try {
        let response = await API(ServerURL + 'shop/settings/admin');
        
        if (response.data != null) {
          setShop(response.data);
          setLoad(true)

        }
      } catch (error) {
        console.error(error)
      }
    };

    const getUsers = async () => {
      try {
        let response = await API(`${ServerURL}api/users/`)
        if (response.data != null) {
          setUsers(response.data);
          setUserLoad(true)

        }

      } catch (error) {
        console.error(error)

      }
    }

    const deleteProduct = async (pid) => {
       
        try {
          let result = await API.delete(ServerURL + 'api/products/' + pid)
          if(result.status === 201) {
            alert("This product was successfully deleted.")
          }
        } catch (error) {
          console.log(error)
        }

    }

    const clearUsers = async () => {
try {
  let result = await API.delete(`${ServerURL}api/users`)
  if(result.status === 201) {
    alert("Inactive users have been cleared")
  }
} catch (error) {
  console.log(error)
}
    }

    const createProduct = async (e) => {
      try {
        e.preventDefault();

        let formData = new FormData(document.getElementById("createForm"));

        const config = {     
          headers: { 'content-type': 'multipart/form-data' }
      }
      
        let result = await API.post(`${ServerURL}api/products`, formData, config)
    console.log(result.data)
      } catch (error) {
        console.log(error)
      }
    }

    

if (load && userLoad) {
    return (
        <div className="main__login">
            
            {shop.length > 0 ? shop.map((el) => {
        return <AdminItem key={el._id} product={el} deleteProduct={deleteProduct} />;
      }) : null}

      {users.length>0 ? users.map((el) => {
        return <div key={el.email}>{el.name}</div>
      }) : null}

      <button onClick={clearUsers}>limpiar inactivos</button>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
            <form id="createForm"
            //  action={ServerURL + `api/products`} 
            //  method="POST" encType="multipart/form-data"
             >
            <input type="text" placeholder="name" name="title" />
            <input type="text" placeholder="description" name="description"/>
            <input type="number" placeholder="price" name="price" />
            <input type="number" placeholder="stock" name="stock" />
            <input type="text" placeholder="code" name="code" />
            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" multiple/>
            <input type="text" placeholder="status" name="status"/>
            <input type="text" placeholder="category" name="category"/>
            <button onClick={createProduct}>crear</button></form>

        </div>
    )
}
}

export default AdminContainer;
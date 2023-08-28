import { useEffect, useState } from "react";
import { API, ServerURL } from "../utils";
import AdminItem from "./AdminItem";
import { useUser } from "../context/UserContext";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'


const AdminContainer = () => {

    const [shop, setShop] = useState([]);
    const [load, setLoad] = useState(false)
    const [users, setUsers] = useState([])
    const [userLoad, setUserLoad] = useState(false)

    const {role} = useUser()
    const MySwal = withReactContent(Swal)

  
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
        console.log(response)
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
        } catch (error) {
          console.log(error)
        }

    }

    const clearUsers = async () => {
try {
  let result = await API.delete(`${ServerURL}api/users`)
  if(result.status === 201) {
    MySwal.fire({
      title: <strong>Misión cumplida</strong>,
      html: <p>Se han eliminado los usuarios inactivos.</p>,
    })     
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
      } catch (error) {
        console.log(error)
      }
    }

    

if (load && userLoad) {
    return (
        <div className="settings">
        <h2>Administrar productos</h2>
            
           <div className="settings__products">
           <div className="settings__products--item">
           {shop.length > 0 ? shop.map((el) => {
        return <AdminItem key={el._id} product={el} deleteProduct={deleteProduct} />;
      }) : null}
           </div>
           <div className="settings__products--create">
            <h3>Creá un nuevo producto</h3>
           <form id="createForm"
            //  action={ServerURL + `api/products`} 
            //  method="POST" encType="multipart/form-data"
             >
              <label>Título </label>
            <input type="text" placeholder="name" name="title" />
            <label>descripción</label>
            <input type="text" placeholder="description" name="description"/>
            <label>precio</label>
            <input type="number" placeholder="price" name="price" />
            <label>stock</label>

            <input type="number" placeholder="stock" name="stock" />
            
                          <label>código único e irrepetible</label>
<input type="text" placeholder="code" name="code" />
<label>thumbnails</label>

            <input type="file" id="thumbnail" name="thumbnail" accept="image/*" multiple/>
            <label>status (true/false)</label>

            <input type="text" placeholder="status" name="status"/>
            <label>categoría</label>
<input type="text" placeholder="category" name="category"/>
<label>Tags separadas únicamente por una coma</label>
 <input type="tags" placeholder="tags" name="tags" />

            <button onClick={createProduct}>crear</button></form>
           </div>
           </div>

     {role ==="admin" ?  <div className="settings__users">
     <h2>Administrar usuarios</h2>

      <div className="settings__users--container">
<div className="settings__users--list">
{users.length>0 ? users.map((el) => {
        return <div key={el.email} className="settings__users--line"><div className="settings__users--data">{el.name}</div><div className="settings__users--data">{el.email}</div></div>
      }) : null}
</div>
<div className="settings__users--delete"><button onClick={clearUsers} className="settings__button">limpiar inactivos</button></div>
      </div>
      </div> : null}
        </div>
    )
}
}

export default AdminContainer;
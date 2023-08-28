import { API, ServerURL } from "../utils";
import { useParams } from "react-router-dom";


const EditProfile = () => {
    const params = useParams();

    const profileUpdate = async (e) => {
        try {
          e.preventDefault();
          let formData = new FormData(document.getElementById("updateForm"));
          const config = {
            headers: { "content-type": "multipart/form-data" },
          };
          let result = await API.post(
            `${ServerURL}api/users/${params.uid}/edit`,
            formData,
            config
          );

        } catch (error) {
          console.log(error);
        }
      };

    return (
        <form id="updateForm" method="POST">
        <label>Nombre</label>
        <input type="text" name="first_name" />
        <br />
        <label>Apellido</label>
        <input type="text" name="last_name" />
        <br />
        <label>Email</label>
        <input type="text" name="email" />
        <br />
        <label>Edad</label>
        <input type="text" name="age" />
        <br />
        <label>Género</label>
        <input type="text" name="gender" />
        <br />
        <label>PFP</label>
        <input type="file" id="pfp" name="pfp" accept="image/*" />

        <button onClick={profileUpdate}>editar</button>
      </form>
    )
}

export default EditProfile
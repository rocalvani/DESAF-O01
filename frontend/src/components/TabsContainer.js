import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { API, ServerURL } from "../utils";

import AddItemButton from "./AddItemButton";
import LikeButton from "./LikeButton";

const MySwal = withReactContent(Swal)
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

export default function VerticalTabs(props) {
  const [value, setValue] = React.useState(0);

  const [newPass, setNewPass] = useState();
  const [passConfirmation, setPassConfirmation] = useState();

  const params = useParams();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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

  const profileDocs = async (e) => {
    try {
      e.preventDefault();
      let formData = new FormData(document.getElementById("docForm"));
      const config = {
        headers: { "content-type": "multipart/form-data" },
      };
      let result = await API.post(
        `${ServerURL}api/users/user/documents/${params.uid}`,
        formData,
        config
      );

    } catch (error) {
      console.log(error);
    }
  }

  
  const passwordUpdate = async (e) => {
    try {
      e.preventDefault();
      let response = await API.put(
        `${ServerURL}api/users/${params.uid}/password`,
        JSON.stringify({ newPass, passConfirmation })
      );
      if (response.status === 201) {
        window.location.replace('/home')
      }
    } catch (error) {
if (error.response.status === 402) {
  MySwal.fire({
    title: <strong>Oops!</strong>,
    html: <p>Las contraseñas ingresadas no son iguales.</p>,
  })  
}    }
  };

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 600 }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Wishlist" {...a11yProps(0)} />
       {props.owner ?  <Tab label="Editar perfil" {...a11yProps(1)} />: null}
       {props.owner ?  <Tab label="Cambiar contraseña" {...a11yProps(2)} />: null}
        {props.owner ?  <Tab label="Pedidos" {...a11yProps(3)} />: null}
      </Tabs>
      <TabPanel value={value} index={0}>
      <div className="wish">
      {props.wishlist.map((el) => (
          <div key={el.product._id} className="wish__container">
            <div className="wish__image">
            <img
        alt="hola"
        src={"../img/products/" + el.product.thumbnail[0].img}
        width="100%"
      />
            </div>
            <div className="wish__desc">
           <b>{el.product.title}</b><br />
            ${el.product.price}
            </div>
            <LikeButton pid={el.product._id} stat="eliminar" />
            <AddItemButton pid={el.product._id} />
          </div>
        ))}
      </div>
      </TabPanel>
     {props.owner ?  <TabPanel value={value} index={1}>
        <div className="profile__update">
        <h3>Actualizar perfil</h3>
      <form id="updateForm" method="POST">
          <label>Nombre</label><br />
          <input type="text" name="first_name" />
          <br />
          <label>Apellido</label><br />
          <input type="text" name="last_name" />
          <br />
          <label>Email</label><br />
          <input type="text" name="email" />
          <br />
          <label>Edad</label><br />
          <input type="text" name="age" />
          <br />
          <label>Género</label><br />
          <input type="text" name="gender" />
          <br />
          <label>PFP</label><br />
          <input type="file" id="pfp" name="pfp" accept="image/*" />

          <button onClick={profileUpdate}>editar</button>
        </form>
<br/>
        <h3>Archivos relevantes</h3>
        <span class="profileSpan">Por favor recordá subir los archivos bajo los nombres id, address y state.</span>

        <form
          id="docForm"
          encType="multipart/form-data"
          multiple
        >
          <label>Archivos de identificación</label>
          <br /> <input
            type="file"
            id="thumbnail"
            name="documents"
            accept="image/*"
            multiple
          />

          <button type="submit" onClick={profileDocs}>editar</button>
        </form>
        </div>
      </TabPanel> : null}
      {props.owner ?  <TabPanel value={value} index={2}>
      <div className="profile__update">
      <form>
          <label>Nueva contraseña</label>
          <input
            type="password"
            name="newPassword"
            onChange={(e) => setNewPass(e.target.value)}
          />
          <br />
          <label>Confirmar la contraseña</label>
          <input
            type="password"
            name="confirmPassword"
            onChange={(e) => setPassConfirmation(e.target.value)}
          />
          <button onClick={passwordUpdate}>editar</button>
        </form></div>
      </TabPanel> : null}
       {props.owner ?  <TabPanel value={value} index={3}>
      {props.tickets.map((el) => (
          <div key={el.code} className="ticket"><b>code: </b>{el.code}</div>
        ))}
      </TabPanel> : null}

    </Box>
  );
}

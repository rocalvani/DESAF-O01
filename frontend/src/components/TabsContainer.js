import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


import { API, ServerURL } from "../utils";

import AddItemButton from "./AddItemButton";
import LikeButton from "./LikeButton";

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
      if (result.status === 201) {
        alert("¡Tu perfil ha sido actualizado!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const passwordUpdate = async (e) => {
    try {
      e.preventDefault();
      let response = await API.post(
        `${ServerURL}api/users/${params.uid}/password`,
        JSON.stringify({ newPass, passConfirmation })
      );
      if (response.status === 400) {
        alert("Tu nueva contraseña debe ser diferente a la anterior.");
      } else if (response.status === 401) {
        alert("Confirmación de contraseña errónea.");
      } else if (response.status === 201) {
        alert("Tu contraseña fue modificada.");
      }
    } catch (error) {
      console.log(error);
    }
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
        <Tab label="Editar perfil" {...a11yProps(1)} />
        <Tab label="Cambiar contraseña" {...a11yProps(2)} />
        <Tab label="Pedidos" {...a11yProps(3)} />
      </Tabs>
      <TabPanel value={value} index={0}>
      {props.wishlist.map((el) => (
          <span key={el.product._id}>
            {el.product.title}
            <LikeButton pid={el.product._id} stat="eliminar" />
            <AddItemButton pid={el.product._id} />
          </span>
        ))}
      </TabPanel>
      <TabPanel value={value} index={1}>
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
      </TabPanel>
      <TabPanel value={value} index={2}>
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
        </form>
      </TabPanel>
      <TabPanel value={value} index={3}>
      {props.tickets.map((el) => (
          <p key={el.code}>{el.code}</p>
        ))}
      </TabPanel>

    </Box>
  );
}

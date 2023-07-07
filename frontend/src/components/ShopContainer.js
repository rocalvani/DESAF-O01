import { React, useEffect, useState } from "react";
import axios from "axios";

import Item from "./Item";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const ShopContainer = () => {
  const [shop, setShop] = useState([]);
  const [load, setLoad] = useState(false)

  useEffect(() => {
    const getShop = async () => {
      try {
        let response = await axios(URL + 'shop/react');
        setShop(response.data);
        setLoad(true)
      } catch (error) {
        console.error(error)
      }
    };
    getShop();
  }, [shop]);

  return (
    <section className="shop__container">
      {shop.map((el) => {
        return <Item key={el._id} product={el} />;
      })}
    </section>
  );
};

export default ShopContainer;

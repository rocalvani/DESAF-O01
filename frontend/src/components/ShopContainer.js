import { React, useEffect, useState } from "react";
import axios from "axios";

import Item from "./Item";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const ShopContainer = () => {
  const [shop, setShop] = useState([]);

  useEffect(() => {
    const getShop = async () => {
      try {
        let response = await axios(URL + 'shop/react');
        setShop(response.data);
      } catch (error) {
        console.error(error)
      }
    };
    getShop();
  });

  return (
    <section className="shop__container">
      {shop.map((el) => {
        return <Item key={el._id} title={el.title} id={el._id} price={el.price} category={el.category} />;
      })}
    </section>
  );
};

export default ShopContainer;

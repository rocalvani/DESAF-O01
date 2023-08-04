import { React, useEffect, useState } from "react";

import Item from "./Item";
import { API } from "../utils";
import { Link, useParams } from "react-router-dom";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const ShopContainer = () => {
  const [shop, setShop] = useState([]);
  const [load, setLoad] = useState(false)
  const [currPage, setCurrPage] = useState(1)
  const [pagination, setPagination] = useState({})
  const [sort, setSort] = useState()
  const [category, setCategory] = useState()
  const [limit, setLimit] = useState()

  const params =useParams()

  useEffect(() => {
    const getShop = async () => {
      try {
        let response = await API(URL + 'shop/', {params: {
          page: currPage,
          category: category,
          limit: limit,
          sort: sort
        }});
        setShop(response.data.docs);
        setCurrPage(response.data.page)
        setPagination({
          hasNextPage: response.data.hasNextPage,
          nextPage: response.data.nextPage,
          hasPrevPage: response.data.hasPrevPage,
          prevPage: response.data.prevPage,
        })
        setLimit(response.data.limit)
        setSort(response.data.sort)
        setCategory(response.data.category)
        setLoad(true)
      } catch (error) {
        console.error(error)
      }
    };
    getShop();
  }, [currPage]);

  const handleChangePrev = () => {
    setCurrPage(pagination.prevPage)
  }

  const handleChangeNext = () => {
    setCurrPage(pagination.nextPage)
  }

 if (load) {
  return (
    <section className="shop__container">
      {shop.map((el) => {
        return <Item key={el._id} product={el} />;
      })}
            {pagination.hasPrevPage ? <button onClick={handleChangePrev}>{pagination.prevPage}</button> : null}

      {pagination.hasNextPage ? <button onClick={handleChangeNext}>{pagination.nextPage}</button> : null}
    </section>
  );
 }
};

export default ShopContainer;

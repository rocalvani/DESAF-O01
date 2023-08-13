import { React, useEffect, useMemo, useState } from "react";

import Item from "./Item";
import { API, ServerURL } from "../utils";
import { Link, useLocation, useParams} from "react-router-dom";

const URL =
  process.env.NODE_ENV === "production" ? "" : "http://localhost:8080/";

const ShopContainer = () => {
  const [shop, setShop] = useState([]);
  const [load, setLoad] = useState(false)
  const [currPage, setCurrPage] = useState(1)
  const [pagination, setPagination] = useState({})


  function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
  }
  const query = useQuery()

  useEffect(() => {
    const getShop = async () => {
      try {
        let response = await API(`${ServerURL}shop?sort=${query.get("sort")}&page=${query.get("page")}&category=${query.get("category")}&limit=${query.get("limit")}`, 
        // {params: {
        //   page: currPage,
        //   category: query.get("category"),
        //   limit: limit,
        //   sort: sort
        // }}
        );
        setShop(response.data.docs);
        setCurrPage(response.data.page)
        setPagination({
          hasNextPage: response.data.hasNextPage,
          nextPage: response.data.nextPage,
          hasPrevPage: response.data.hasPrevPage,
          prevPage: response.data.prevPage,
        })

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
            {pagination.hasPrevPage ? <a href={`/shop?sort=${query.get("sort")}&page=${pagination.prevPage}&category=${query.get("category")}&limit=${query.get("limit")}`}><button>{pagination.prevPage}</button></a> : null}

      {pagination.hasNextPage ? <a href={`/shop?sort=${query.get("sort")}&page=${pagination.nextPage}&category=${query.get("category")}&limit=${query.get("limit")}`}><button >{pagination.nextPage}</button></a> : null}
    </section>
  );
 }
};

export default ShopContainer;

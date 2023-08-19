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
        );
        if (response.status === 201) {
          setShop(response.data.docs);
        setCurrPage(response.data.page)
        setPagination({
          hasNextPage: response.data.hasNextPage,
          nextPage: response.data.nextPage,
          hasPrevPage: response.data.hasPrevPage,
          prevPage: response.data.prevPage,
        })

        setLoad(true)
        } else if (response.status === 401) {
          window.location.replace('/login')

        }
      } catch (error) {
        window.location.replace('/login')
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
    <section className="shop">
                  <div className="main__photo"></div>

      <div className="shop__container">{shop.map((el) => {
        return <Item key={el._id} product={el} />;
      })}</div>
            {pagination.hasPrevPage ? <a href={`/shop?sort=${query.get("sort")}&page=${pagination.prevPage}&category=${query.get("category")}&limit=${query.get("limit")}`}><button>{pagination.prevPage}</button></a> : null}

      {pagination.hasNextPage ? <a href={`/shop?sort=${query.get("sort")}&page=${pagination.nextPage}&category=${query.get("category")}&limit=${query.get("limit")}`}><button >{pagination.nextPage}</button></a> : null}
    </section>
  );
 }
};

export default ShopContainer;

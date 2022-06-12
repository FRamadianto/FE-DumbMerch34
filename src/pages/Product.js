import Masonry from "react-masonry-css";
import { Container, Row, Col } from "react-bootstrap";

import Navbar from "../components/Navbar";
import ProductCard from "../components/card/ProductCard";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
// Import useQuery
import { useQuery } from "react-query";

// API config
import { API } from "../config/api";

export default function Product() {
  let api = API();

  const title = "product";
  document.title = title;

  //fitur
  const [datas, setDatas] = useState([]);
  const [sortType, setSortType] = useState('id');

  // Fetching categories data from database
  let { data: categories } = useQuery("categoriesCache", async () => {
    const response = await api.get("/categories");
    return response.data;
    console.log(response.data)
  });

  // Fetching product data from database
  let { data: products, refetch } = useQuery("productsCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/products", config);
    return response.data;
  });

  // FITUR
  useEffect(() => {
    const sortArray = type => {
      const types = {
        price: 'price',
        qty: 'qty',
      };
      const sortProperty = types[type];
      const sorted = [...datas].sort((a, b) => a[sortProperty] - b[sortProperty]);
      setDatas(sorted);
    };
    sortArray(sortType);
  }, [sortType]);

  // END OF FITUR
  const breakpointColumnsObj = {
    default: 6,
    1100: 4,
    700: 3,
    500: 2,
  };

  return (
    <div>
      <Navbar title={title}/>
      <Container className="mt-5">
        <Row>
          <Col>
            <div className="text-header-product mb-4">Product</div>
            {categories?.map((item, index) => (
            // <select onChange={(e) => setSortType(e.target.value)}> 
            //     {/* <option value="price">Category</option> */}
            //     <option value="qty">qw</option>
            //     <option value="qty">baju</option>
            //     <option value="qty">juba</option>

            // </select>
            <Link  
              to={`/category/` + item.id}
              className="text-danger border border-danger rounded pt-1 pb-1 ps-2 pe-2"  
              style={{ textDecoration: "none" ,marginRight:"20px"}}
              key={index}
            >{item.name}
            </Link>
            ))}
          </Col>
        </Row>
        <Row className="my-4">
          {products?.length != 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {products?.map((item, index) => (
                <ProductCard item={item} index={index} />
              ))}
            </Masonry>
          ) : (
            <Col>
              <div className="text-center pt-5">
                <div className="mt-3">No data product</div>
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

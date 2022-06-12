import Masonry from "react-masonry-css";
import { Container, Row, Col } from "react-bootstrap";

import Navbar from "../components/Navbar";
import SortingProductCard from "../components/card/SortingProductCard";
import { useParams,Link } from "react-router-dom";

import { useEffect, useState } from "react";

// Import useQuery and useMutation
import { useQuery, useMutation } from 'react-query';

// API config
import { API } from "../config/api";

export default function SortingProduct() {
  let api = API();
  let { id } = useParams();

  const title = "product";
  document.title = title;

   // Fetching product data from database
   let { data: category, refetch } = useQuery('Cache', async () => {
    const config = {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + localStorage.token,
      },
    };
    const response = await api.get('/category/' + id, config);
    return response.data;
  });
  // console.log(category);

  //fitur
  // const [datas, setDatas] = useState([]);
  // const [sortType, setSortType] = useState('id');

  // // Fetching categories data from database
  // let { datas: categories } = useQuery("categoriesCache", async () => {
  //   const response = await api.get("/categories");
  //   return response.datas;
  // });


  // FITUR
  // useEffect(() => {
  //   const sortArray = type => {
  //     const types = {
  //       price: 'price',
  //       qty: 'qty',
  //     };
  //     const sortProperty = types[type];
  //     const sorted = [...datas].sort((a, b) => a[sortProperty] - b[sortProperty]);
  //     setDatas(sorted);
  //   };
  //   sortArray(sortType);
  // }, [sortType]);

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
            {/* {categories?.map((item, index) => (
            <Link  
              to={`/category/` + item.id}
              className="text-danger border border-danger rounded pt-1 pb-1 ps-2 pe-2"  
              style={{ textDecoration: "none" ,marginRight:"20px"}}
              key={index}
            >{item.name}
            </Link>
            ))} */}
          </Col>
        </Row>
        <Row className="my-4">
          {category?.length != 0 ? (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {/* {category?.map((item, index) => ( */}
                <SortingProductCard category={[category]} />
              {/* ))}  */}
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

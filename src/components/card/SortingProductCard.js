import React from "react";
import { Link } from "react-router-dom";

import convertRupiah from "rupiah-format";

export default function SortingProductCard({category}) {
  console.log(category);
  return (
  
    // <Link
    //   to={`/product/` + item.category.products.id}
    //   style={{ textDecoration: "none" }}
    //   key={index}
    // >
    //   <div className="card-product mt-3 ">
    //     <img src={item.category.products.image} className="img-fluid img-rounded" />
    //     <div className="p-2">
    //       <div className="text-header-product-item">{item.category.products.name}</div>
    //       <div className="text-product-item">
    //         {convertRupiah.convert(item.category.products.price)}
    //       </div>
    //       <div className="text-product-item">Stock : {item.category.products.qty}</div>
    //     </div>
    //   </div>
    // </Link>
    <></>
  );
}

import { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate} from "react-router-dom";
import { UserContext } from "./context/userContext";

import Auth from "./pages/Auth";
import Product from "./pages/Product";
import DetailProduct from "./pages/DetailProduct";
import Complain from "./pages/Complain";
import Profile from "./pages/Profile";
import ComplainAdmin from "./pages/ComplainAdmin";
import CategoryAdmin from "./pages/CategoryAdmin";
import ProductAdmin from "./pages/ProductAdmin";
import UpdateCategoryAdmin from "./pages/UpdateCategoryAdmin";
import AddCategoryAdmin from "./pages/AddCategoryAdmin";
import AddProductAdmin from "./pages/AddProductAdmin";
import AddProfile from "./pages/AddProfile";
import UpdateProductAdmin from "./pages/UpdateProductAdmin";
import UpdateProfile from "./pages/UpdateProfile";
import SortingProduct from "./pages/SortingProduct";

import { API } from "./config/api";

function App() {
  let api = API();
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    // Redirect Auth
    if (state.isLogin == false) {
      navigate("/auth");
    } else {
      if (state.user.status == "admin") {
        navigate("/product-admin");
        // navigate("/complain-admin");
      } else if (state.user.status == "customer") {
        navigate("/");
      }
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/check-auth", config);

      // If the token incorrect
      if (response.status === "failed") {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // // Get user data
      let payload = response.data.user;
      // // Get token from local storage
      payload.token = localStorage.token;

      // // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={ < Product />} />
      <Route exact path="/category/:id" element={ < SortingProduct />} />
      <Route path="/auth" element={< Auth />} />
      <Route path="/product/:id" element={< DetailProduct />} />
      <Route path="/complain" element={< Complain />} />
      <Route path="/profile" element={< Profile />} />
      <Route path="/complain-admin" element={< ComplainAdmin />} />
      <Route path="/category-admin" element={< CategoryAdmin />} />
      <Route path="/edit-category/:id" element={< UpdateCategoryAdmin />} />
      <Route path="/add-category" element={< AddCategoryAdmin />} />
      <Route path="/product-admin" element={< ProductAdmin />} />
      <Route path="/add-product" element={< AddProductAdmin />} />
      <Route path="/add-profile" element={< AddProfile />} />
      <Route path="/edit-product/:id" element={< UpdateProductAdmin />} />
      <Route path="/edit-profile/:id" element={< UpdateProfile />} />
    </Routes>
  );
}

export default App;

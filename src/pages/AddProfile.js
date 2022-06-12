import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";

// Import useQuery & useMutation
import { useQuery, useMutation } from "react-query";

// Import API config
import { API } from "../config/api";

export default function AddProfile() {
  const title = "Product admin";
  document.title = title;

  let navigate = useNavigate();
  let api = API();

  // const [categories, setCategories] = useState([]); //Store all category data
 
  const [preview, setPreview] = useState(null); //For image preview
  const [form, setForm] = useState({
    image: "",
    phone: "",
    gender: "",
    address: "",
  }); //Store product data

  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
    
    // Store data with FormData as object
    const formData = new FormData();
    formData.set("image", form?.image[0], form?.image[0]?.name);
    formData.set("phone", form.phone);
    formData.set("gender", form.gender);
    formData.set("address", form.address);

      
    // Configuration
    const config = {
      method: "POST",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
      body: formData,
    };

    // Insert product data
    const response = await api.post("/profile", config);

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4">Add Product</div>
          </Col>
          <Col xs="12">
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              {preview && (
                <div>
                  <img
                    src={preview}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}
              <input
                type="file"
                id="upload"
                name="image"
                hidden
                onChange={handleChange}
              />
              <label for="upload" className="label-file-add-product">
                Upload file
              </label>
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                onChange={handleChange}
                className="input-edit-category mt-4"
              />
              <select  className="input-edit-category mt-4" name="gender"  onChange={handleChange} aria-label="Default select example">
                  <option selected>Open this select for gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
              </select>
              <textarea
                placeholder="Address"
                name="address"
                onChange={handleChange}
                className="input-edit-category mt-4"
                style={{ height: "130px" }}
              ></textarea>

              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="success" size="md">
                  Add
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

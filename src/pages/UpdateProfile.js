import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router";

import Navbar from "../components/Navbar";

// Import useQuery & useMutation
import { useQuery, useMutation } from "react-query";

// Import API config
import { API } from "../config/api";

export default function UpdateProfile() {
  const title = "Profile";
  document.title = title;

  let navigate = useNavigate();
  let api = API();
  const { id } = useParams();

  // const [categories, setCategories] = useState([]); //Store all category data
  const [profile, setProfile] = useState({}); //Store product data
  const [preview, setPreview] = useState(null); //For image preview
  const [form, setForm] = useState({
    image: "",
    phone: "",
    gender: "",
    address: "",
  }); //Store product data

  // Fetching detail product data by id from database
  let { profileRefetch } = useQuery("profileCache", async () => {
    const config = {
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/profile/" + id, config);
    setForm({
      phone: response.data.phone,
      address: response.data.address,
      gender: response.data.gender,
      image: response.data.image,
    });
    setProfile(response.data);
    console.log(response.data)
  });

  // Handle change data on form
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      setPreview(e.target.files);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (preview) {
        formData.set("image", preview[0], preview[0]?.name);
      }
      formData.set("phone", form.phone);
      formData.set("gender", form.gender);
      formData.set("address", form.address);

      
      // Configuration
      const config = {
          method: "PATCH",
          headers: {
            Authorization: "Basic " + localStorage.token,
          },
          body: formData,
      };

      // Insert product data
      const response = await api.patch("/profile/" + profile.id, config);
      console.log(profile.id)

      navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <Navbar title={title} />
      <Container className="py-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4">Edit Product</div>
          </Col>
          <Col xs="12">
          <form onSubmit={(e) => handleSubmit.mutate(e)}>
              {!preview ? (
                <div>
                  <img
                    src={form.image}
                    style={{
                      maxWidth: "150px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <img
                    src={URL.createObjectURL(preview[0])}
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
                value={form.phone}
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
                value={form.address}
                className="input-edit-category mt-4"
                style={{ height: "130px" }}
              ></textarea>

              <div className="d-grid gap-2 mt-4">
              <Button type="submit" variant="success" size="md">
                  Save
              </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

import React , {useState,useEffect}from 'react'
import { Modal, Button, } from 'react-bootstrap'
// Import API config
import { API } from "../../config/api";
// Import useQuery & useMutation
import {useQuery, useMutation } from "react-query";
import { useNavigate } from "react-router";

export default function AddProfile({show, handleClose}) {
  let navigate = useNavigate();
  let api = API();

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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Body className="text-dark">
          <div style={{fontSize: '20px', fontWeight: '900',MarginBottom:'50px'}}>
              Add Profile
          </div>
          <form className='mt-4' onSubmit={(e) => handleSubmit.mutate(e)}>
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
                  <div class="mb-3">
                  <label for="photo" class="form-label">Image</label>
                  <input type="file" name="image"  onChange={handleChange} class="form-control" id="photo" aria-describedby="emailHelp" placeholder="image"></input>
                  </div>
                  
                  <div class="mb-3">
                  <label for="price" class="form-label">Phone</label>
                  <input type="text" name="phone"  onChange={handleChange} class="form-control" id="Phone" placeholder="phone"></input>
                  </div>
                  <div class="mb-3">
                  </div>
                  <label for="Qty" class="form-label">Gender</label>
                  <select class="form-select" name="gender"  onChange={handleChange} aria-label="Default select example">
                  <option selected>Open this select for gender</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                  </select>
                  <div className='mt-3'>
                  <label for="price" class="form-label">Address</label>
                  <textarea name="address"  onChange={handleChange} class="form-control" id="address" placeholder="address"></textarea>
                  </div>
              </form>
          <div className="text-end mt-5">
              <Button type="submit" size="sm" className="btn-success me-2" style={{width: '135px'}}>add</Button>
              <Button onClick={handleClose} size="sm" className="btn-danger" style={{width: '135px'}}>Cancel</Button>
          </div>
      </Modal.Body>
    </Modal>
  )
}

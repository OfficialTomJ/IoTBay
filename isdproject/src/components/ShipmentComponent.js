import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

const ShippingComponent = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");

  const fetchUserAddresses = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        "http://localhost:8080/api/shipment/user-addresses",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setAddresses(response.data.addresses);
    } catch (error) {
      console.error("Error fetching user addresses:", error);
    }
  };

  useEffect(() => {
    fetchUserAddresses();
  }, []);

  const handleAddressChange = (e) => {
    setSelectedAddress(e.target.value);
  };

  return (
    <>
      <h3>Choose Shipping Address</h3>
      <select
        style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
        onChange={handleAddressChange}
        value={selectedAddress}
      >
        <option value="">Select a saved shipping address</option>
        {addresses.map((address, index) => (
          <option key={index} value={address}>
            {address}
          </option>
        ))}
      </select>
      {selectedAddress === "" && (
        <>
          <hr
            style={{ marginBottom: "10px", borderTop: "1px solid #eaeaea" }}
          />
          <h3>Or enter a new shipping address</h3>
          <textarea
            placeholder="Enter shipping address..."
            style={{ marginBottom: "20px", width: "100%", padding: "10px" }}
          ></textarea>
        </>
      )}
      <hr style={{ marginBottom: "10px", borderTop: "1px solid #eaeaea" }} />
      <h3>Choose Shipping Method</h3>
      <select
        style={{
          marginBottom: "20px",
          width: "100%",
          padding: "10px",
        }}
      >
        <option value="">Select a shipment method with estimated cost</option>
        <option value="Sea">$5.00 - Sea Shipping</option>
        <option value="Air">$10.00 - Air Shipping</option>
      </select>
    </>
  );
};

export default ShippingComponent;

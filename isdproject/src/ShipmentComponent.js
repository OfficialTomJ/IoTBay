import React from "react";

const ShippingComponent = () => {
  return (
    <>
      <h3>Choose Shipping Address</h3>
      <select style={{ marginBottom: "10px", width: "100%", padding: "10px" }}>
        <option value="">Select a saved shipping address</option>
        <option value="address1">123 Shipping Street, City, Country</option>
      </select>
      <hr style={{ marginBottom: "10px", borderTop: "1px solid #eaeaea" }} />
      <h3>Or enter a new shipping address</h3>
      <textarea
        placeholder="Enter shipping address..."
        style={{ marginBottom: "20px", width: "100%", padding: "10px" }}
      ></textarea>
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
        <option value="standard">$5.00 - Standard Shipping</option>
        <option value="express">$10.00 - Express Shipping</option>
      </select>
    </>
  );
};

export default ShippingComponent;

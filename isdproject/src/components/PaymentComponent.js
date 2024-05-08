const PaymentComponent = () => {
  return (
    <>
      <select style={{ marginBottom: "10px", width: "100%", padding: "10px" }}>
        <option value="">Select a saved payment method</option>
        <option value="paypal">Credit Card ###</option>
      </select>
      <hr style={{ marginBottom: "10px", borderTop: "1px solid #eaeaea" }} />
      <h3>Or a new payment method</h3>
      <select
        style={{
          marginTop: "10px",
          marginBottom: "20px",
          width: "100%",
          padding: "10px",
        }}
      >
        <option value="">Select a payment method</option>
        <option value="credit_card">Credit Card</option>
      </select>
      {/* Payment inputs */}
      <input
        type="text"
        placeholder="Card Number"
        style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
      />
      <input
        type="text"
        placeholder="Expiration Date (MM/YY)"
        style={{ marginBottom: "10px", width: "100%", padding: "10px" }}
      />
      <input
        type="text"
        placeholder="CVV"
        style={{ marginBottom: "20px", width: "100%", padding: "10px" }}
      />
    </>
  );
};
export default PaymentComponent;

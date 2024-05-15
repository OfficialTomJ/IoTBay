import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAlert } from "react-alert";

const PaymentPage = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    userCardNum: "",
    userCardExpiry: "",
    userCVV: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [payments, setPayments] = useState([]);

  const navigate = useNavigate();
  const alert = useAlert();

  useEffect(() => {
    fetchPaymentMethods();
    fetchPayments();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "http://localhost:8080/api/payment/methods",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setPaymentMethods(response.data.paymentMethods);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "http://localhost:8080/api/payments",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setPayments(response.data.payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
    }
  };

  const handleNewPaymentMethodChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentMethod((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddPaymentMethod = async () => {
    try {
      // Convert string values to integers
      const cardNum = parseInt(newPaymentMethod.userCardNum);
      const cardExpiry = parseInt(newPaymentMethod.userCardExpiry);
      const cvv = parseInt(newPaymentMethod.userCVV);
  
      // Check if conversion is successful
      if (isNaN(cardNum) || isNaN(cardExpiry) || isNaN(cvv)) {
        alert.error("Please enter valid numeric values for card details.");
        return;
      }
  
      const token = Cookies.get("token");
      await axios.post(
        "http://localhost:8080/api/payment/create",
        {
          ...newPaymentMethod,
          userCardNum: cardNum,
          userCardExpiry: cardExpiry,
          userCVV: cvv
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      alert.success("Payment method added successfully!");
      fetchPaymentMethods();
    } catch (error) {
      alert.error("Error adding payment method: " + error.response.data.msg);
    }
  };
  

  const handleDeletePaymentMethod = async (methodId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment method?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.delete("http://localhost:8080/api/payment/methods/delete", {
        headers: {
          Authorization: `${token}`,
        },
        data: {
          id: methodId,
        },
      });
      alert.success("Payment method deleted successfully!");
      fetchPaymentMethods();
    } catch (error) {
      alert.error("Error deleting payment method: " + error.response.data.msg);
    }
  };

  const filteredPayments = payments.filter((payment) =>
    payment.userCardNum.includes(searchTerm)
  );

  return (
    <div
      style={{ backgroundColor: "#e3f2fd", minHeight: "100vh", padding: 20 }}
    >
      <div style={{ marginTop: 20 }}>
        <h2 style={{ fontSize: 24, marginBottom: 10 }}>Payment Methods</h2>
        {/* Add New Payment Method */}
        <div style={{ border: '1px solid #ccc', borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <h3>Add New Payment Method</h3>
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="userCardNum"
              value={newPaymentMethod.userCardNum}
              onChange={handleNewPaymentMethodChange}
              placeholder="Card Number"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="userCardExpiry"
              value={newPaymentMethod.userCardExpiry}
              onChange={handleNewPaymentMethodChange}
              placeholder="Expiry Date"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <input
              type="text"
              name="userCVV"
              value={newPaymentMethod.userCVV}
              onChange={handleNewPaymentMethodChange}
              placeholder="CVV"
              style={{
                width: "100%",
                padding: 10,
                borderRadius: 4,
                border: "1px solid #ccc",
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              style={{
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: 4,
              }}
              onClick={handleAddPaymentMethod}
            >
              Add Payment Method
            </button>
          </div>
        </div>
        {/* Payment History */}
        <div>
          <h2 style={{ fontSize: 24, marginBottom: 10 }}>Payment History</h2>
          <input
            type="text"
            placeholder="Search by Card Number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 4,
              border: "1px solid #ccc",
              marginBottom: 20
            }}
          />
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Transaction ID</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Card Number</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Expiry Date</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>CVV</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((payment, index) => (
                <tr key={index}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{payment.transactionId}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{payment.userCardNum}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{payment.userCardExpiry}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{payment.userCVV}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
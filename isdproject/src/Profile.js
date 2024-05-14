import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useAlert } from "react-alert";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isEditable, setIsEditable] = useState(false);
  const [userLogs, setUserLogs] = useState([]);
  const [searchTime, setSearchTime] = useState("");
  const [shipments, setShipments] = useState([]); // State to store user's shipments
  const [newShipment, setNewShipment] = useState({
    // State for a new shipment
    orderId: "",
    shipmentMethod: "",
    address: "",
    status: "",
    tracking: "",
    date: "",
  });
  const [orderHistory, setOrderHistory] = useState([]);
  const [orderIdSearch, setOrderIdSearch] = useState('');
  const [dateSearch, setDateSearch] = useState('');
  const [editingShipments, setEditingShipments] = useState(
    Array(shipments.length).fill(false)
  ); // State to track editing status of shipments

  const navigate = useNavigate();

  const alert = useAlert();

  useEffect(() => {
    const token = Cookies.get("token");
    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          headers: {
            Authorization: `${token}`,
          },
        });
        setUser(res.data.user);
        setFullName(res.data.user.fullName);
        setEmail(res.data.user.email);
        setPhone(res.data.user.phone);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (token) {
      fetchUserData();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchUserLogs();
    fetchUserShipments();
    generateSampleOrderHistory(); // Fetch sample order history data
  }, []);

  const fetchUserLogs = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get("http://localhost:8080/api/user/logs", {
        headers: {
          Authorization: token,
        },
      });
      setUserLogs(response.data.userLogs);
    } catch (error) {
      console.error("Error fetching user logs:", error);
    }
  };

  const fetchUserShipments = async () => {
    const token = Cookies.get("token");
    try {
      const response = await axios.get(
        "http://localhost:8080/api/shipment/user-shipments",
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const formattedShipments = response.data.shipments.map((shipment) => ({
        ...shipment,
        date: formatDate(shipment.date),
      }));
      setShipments(formattedShipments);
    } catch (error) {
      console.error("Error fetching user shipments:", error);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/logout");
  };

  const formatDate = (isoDateString) => {
    const date = new Date(isoDateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
      timeZone: "UTC", // Adjust the time zone if needed
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.delete("http://localhost:8080/api/user", {
        headers: {
          Authorization: `${token}`,
        },
      });
      Cookies.remove("token");
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/generate-password-token",
        { email }
      );
      const resetUrl = response.data;
      window.open(resetUrl.link, "_blank");
    } catch (error) {
      console.error("Error resetting password:", error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = Cookies.get("token");
      await axios.put(
        "http://localhost:8080/api/user/profile",
        { fullName, email, phone },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      const res = await axios.get("http://localhost:8080/api/user/profile", {
        headers: {
          Authorization: `${token}`,
        },
      });
      setUser(res.data.user);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleSearchLogs = () => {
    const filteredLogs = userLogs.filter((log) =>
      log.timestamp.includes(searchTime)
    );
    setUserLogs(filteredLogs);
  };

  const handleResetSearch = () => {
    setSearchTime("");
    fetchUserLogs();
  };

  // Function to handle changes in the new shipment form
  const handleNewShipmentChange = (e) => {
    const { name, value } = e.target;
    setNewShipment((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Function to add a new shipment
  const handleAddShipment = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "http://localhost:8080/api/shipment/create",
        newShipment,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      alert.success("Shipment Created!");
      fetchUserShipments();
    } catch (error) {
      alert.error("Error creating shipment: " + error.response.data.msg);
    }
  };

  const handleSearchOrderHistory = async () => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get('http://localhost:8080/api/order/history', {
        headers: {
          Authorization: `${token}`
        },
        params: {
          orderId: orderIdSearch,
          date: dateSearch
        }
      });
      setOrderHistory(response.data.orderHistory);
    } catch (error) {
      console.error('Error searching order history:', error);
    }
  };

  const handleResetOrderHistorySearch = () => {
    setOrderIdSearch('');
    setDateSearch('');
    generateSampleOrderHistory(); // Reset order history to initial state
  };

  // Function to generate sample order history data
  const generateSampleOrderHistory = () => {
    const sampleData = [];
    const currentYear = new Date().getFullYear();
    for (let i = 20; i >= 1; i--) {
      // Generate a random date between January 2023 and December 2024
      const randomYear = currentYear - (Math.floor((20 - i) / 12));
      const randomMonth = (12 - ((20 - i) % 12)) || 12;
      const randomDay = Math.floor(Math.random() * 28) + 1; // Assuming all months have 28 days for simplicity
      const randomDate = new Date(`${randomYear}-${randomMonth}-${randomDay}`);
      sampleData.push({
        orderId: `Order ${i}`,
        date: randomDate.toISOString(),
        description: `Description for Order ${i}`
      });
    }
    setOrderHistory(sampleData);
  };
  
  // Functions to handle changes in shipment details
  const handleShipmentMethodChange = (e, index) => {
    const { value } = e.target;
    setShipments((prevShipments) => {
      const updatedShipments = [...prevShipments];
      updatedShipments[index] = {
        ...updatedShipments[index],
        shipmentMethod: value,
      };
      return updatedShipments;
    });
  };

  // Functions to handle changes in shipment details
  const handleAddressChange = (e, index) => {
    const { value } = e.target;
    setShipments((prevShipments) => {
      const updatedShipments = [...prevShipments];
      updatedShipments[index] = {
        ...updatedShipments[index],
        address: value,
      };
      return updatedShipments;
    });
  };

  // Function to update shipment details
  const handleUpdateShipment = async (shipment) => {
    // Split the date string into its components
    const dateComponents = shipment.date.split(" ");

    // Extract individual components
    const month = dateComponents[0];
    const day = parseInt(dateComponents[1].replace(",", ""));
    const year = parseInt(dateComponents[2]);
    const time = dateComponents[4];
    const [hours, minutes, seconds] = time
      .split(":")
      .map((component) => parseInt(component));

    // Construct a Date object
    const isoDate = new Date(
      year,
      getMonthIndex(month),
      day,
      hours,
      minutes,
      seconds
    ).toISOString();

    // Update shipment object with ISO date
    const updatedShipment = { ...shipment, date: isoDate };

    try {
      const token = Cookies.get("token");
      await axios.put(
        "http://localhost:8080/api/shipment/update",
        updatedShipment,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      fetchUserShipments();
      alert.success("Updated shipment! ");
    } catch (error) {
      alert.error("Error updating shipment: " + error.response.data.msg);
    }
  };

  // Helper function to get the index of the month
  const getMonthIndex = (month) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return months.indexOf(month);
  };

  // Function to delete a shipment
  const handleDeleteShipment = async (shipment) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shipment?"
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.delete("http://localhost:8080/api/shipment/delete", {
      headers: {
        Authorization: `${token}`,
      },
      data: {
      id: shipment._id,
      },
    });
      fetchUserShipments();
      alert.success("Deleted Shipment!");
    } catch (error) {
      alert.error("Error deleting shipment: " + error.response.data.msg);
    }
  };

  // Function to toggle editing status of a shipment
  const toggleEditing = (index) => {
    setEditingShipments((prevEditingShipments) => {
      const newEditingShipments = [...prevEditingShipments];
      newEditingShipments[index] = !newEditingShipments[index];
      return newEditingShipments;
    });
  };

  // Function to handle cancellation of editing
  const handleCancelEdit = (index) => {
    toggleEditing(index);
    fetchUserShipments();
  };

  // Function to handle updating shipment information
  const handleConfirmUpdate = async (index) => {
    try {
      const shipment = shipments[index];
      await handleUpdateShipment(shipment);
      toggleEditing(index);
      fetchUserShipments();
    } catch (error) {
      console.error("Error updating shipment:", error);
    }
  };

  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchDate, setSearchDate] = useState("");

  //Function to handle database query for shipment search
  const handleSearchOrders = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "http://localhost:8080/api/shipment/search",
        {
          headers: {
            Authorization: `${token}`,
          },
          params: {
            shipmentId: searchOrderId,
            date: searchDate,
          },
        }
      );
      // Handle the response data, set state, or perform any other actions
      const formattedShipments = response.data.shipments.map((shipment) => ({
        ...shipment,
        date: formatDate(shipment.date),
      }));
      setShipments(formattedShipments);
    } catch (error) {
      alert.error("Shipment search error: " + error.response.data.msg);
    }
  };
   //Function to reset search parameters for shipments
  const handleResetSearchShipments = () => {
    setSearchOrderId("");
    setSearchDate("");
    fetchUserShipments();
  };
  return (
    <div
      style={{ backgroundColor: "#e3f2fd", minHeight: "100vh", padding: 20 }}
    >
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: 4,
          }}
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "80%",
            maxWidth: 800,
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 40,
            boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 32, fontWeight: "bold", marginBottom: 20 }}>
              Profile
            </h2>
            {user && (
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    Full Name:
                  </label>
                  {isEditable ? (
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <span>{fullName}</span>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    Email:
                  </label>
                  {isEditable ? (
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <span>{email}</span>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    Phone:
                  </label>
                  {isEditable ? (
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: 10,
                        borderRadius: 4,
                        border: "1px solid #ccc",
                      }}
                    />
                  ) : (
                    <span>{phone}</span>
                  )}
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    Role:
                  </label>{" "}
                  {user.role}
                </div>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <button
                    style={{
                      marginRight: 10,
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                    }}
                    onClick={() => {
                      setIsEditable(!isEditable);
                      if (isEditable) {
                        handleUpdateProfile();
                      }
                    }}
                  >
                    {isEditable ? "Save" : "Edit"}
                  </button>
                  <button
                    style={{
                      marginRight: 10,
                      backgroundColor: "#007bff",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                    }}
                    onClick={handleResetPassword}
                  >
                    Reset Password
                  </button>
                  <button
                    style={{
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: 4,
                    }}
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            )}
          </div>
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>User Logs</h2>
            <div
              style={{ border: "1px solid #ccc", borderRadius: 8, padding: 20 }}
            >
              <input
                type="text"
                placeholder="Search by time..."
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)}
                style={{
                  marginBottom: 10,
                  padding: "8px 12px",
                  fontSize: 16,
                  borderRadius: 4,
                  border: "1px solid #ccc",
                }}
              />
              <button
                style={{
                  marginRight: 10,
                  backgroundColor: "#007bff",
                  color: "#fff",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: 4,
                }}
                onClick={handleSearchLogs}
              >
                Search
              </button>
              {searchTime && (
                <button
                  style={{
                    marginRight: 10,
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
                  }}
                  onClick={handleResetSearch}
                >
                  Reset
                </button>
              )}
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {userLogs.map((log, index) => (
                  <li key={index} style={{ marginBottom: 8, fontSize: 14 }}>
                    {log.timestamp}: {log.eventType}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>
              Previous Shipments
            </h2>
            <div
              style={{ border: "1px solid #ccc", borderRadius: 8, padding: 20 }}
            >
              <div style={{ marginBottom: 20 }}>
                <input
                  type="text"
                  name="orderId"
                  value={newShipment.orderId}
                  onChange={handleNewShipmentChange}
                  placeholder="Order ID"
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
                  name="shipmentMethod"
                  value={newShipment.shipmentMethod}
                  onChange={handleNewShipmentChange}
                  placeholder="Shipment Method"
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
                  name="address"
                  value={newShipment.address}
                  onChange={handleNewShipmentChange}
                  placeholder="Address"
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
                  name="status"
                  value={newShipment.status}
                  onChange={handleNewShipmentChange}
                  placeholder="Status"
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
                  name="tracking"
                  value={newShipment.tracking}
                  onChange={handleNewShipmentChange}
                  placeholder="Tracking"
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
                  onClick={handleAddShipment}
                >
                  Add Shipment
                </button>
              </div>
            </div>
            <div style={{ marginTop: 20 }}>
              <h2 style={{ fontSize: 24, marginBottom: 10 }}>Search Orders</h2>
              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 20,
                }}
              >
                <input
                  type="text"
                  placeholder="Shipment ID"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  style={{
                    marginBottom: 10,
                    padding: "8px 12px",
                    fontSize: 16,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  style={{
                    marginBottom: 10,
                    padding: "8px 12px",
                    fontSize: 16,
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
                <button
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
                    marginLeft: 10,
                  }}
                  onClick={handleSearchOrders}
                >
                  Search
                </button>
                <button
                  style={{
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
                    marginLeft: 10,
                  }}
                  onClick={handleResetSearchShipments}
                >
                  Reset
                </button>
              </div>
            </div>

            {shipments.length === 0 && <p>No previous shipments available</p>}
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {shipments.map((shipment, index) => (
                <li key={index} style={{ marginBottom: 8 }}>
                  <div
                    style={{
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      padding: 10,
                    }}
                  >
                    <div>
                      <strong>Order ID:</strong> {shipment.orderId}
                    </div>
                    <div>
                      <strong>Shipment Method:</strong>
                      {editingShipments[index] ? (
                        <select
                          name="shipmentMethod"
                          value={shipment.shipmentMethod}
                          onChange={(e) => handleShipmentMethodChange(e, index)}
                          style={{ marginLeft: 10 }}
                        >
                          <option value="Sea">Sea</option>
                          <option value="Air">Air</option>
                        </select>
                      ) : (
                        <span>{shipment.shipmentMethod}</span>
                      )}
                    </div>
                    <div>
                      <strong>Address:</strong>
                      {editingShipments[index] ? (
                        <input
                          type="text"
                          name="address"
                          value={shipment.address}
                          onChange={(e) => handleAddressChange(e, index)}
                          style={{ marginLeft: 10 }}
                        />
                      ) : (
                        <span>{shipment.address}</span>
                      )}
                    </div>
                    <div>
                      <strong>Status:</strong> {shipment.status}
                    </div>
                    <div>
                      <strong>Tracking:</strong> {shipment.tracking}
                    </div>
                    <div>
                      <strong>Date:</strong> {shipment.date}
                    </div>
                    {/* Render update and delete buttons for shipments with status "processing" */}
                    {shipment.status === "processing" && (
                      <div style={{ marginTop: 10 }}>
                        {editingShipments[index] ? (
                          <>
                            <button
                              style={{
                                backgroundColor: "#28a745",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: 4,
                                marginRight: 10,
                              }}
                              onClick={() => handleConfirmUpdate(index)}
                            >
                              Confirm
                            </button>
                            <button
                              style={{
                                backgroundColor: "#dc3545",
                                color: "#fff",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: 4,
                              }}
                              onClick={() => handleCancelEdit(index)}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <button
                            style={{
                              backgroundColor: "#007bff",
                              color: "#fff",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: 4,
                              marginRight: 10,
                            }}
                            onClick={() => toggleEditing(index)}
                          >
                            Edit
                          </button>
                        )}
                        {!editingShipments[index] && (
                          <button
                            style={{
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              border: "none",
                              padding: "8px 16px",
                              borderRadius: 4,
                            }}
                            onClick={() => handleDeleteShipment(shipment)}
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div style={{ marginTop: 20 }}>
            <h2 style={{ fontSize: 24, marginBottom: 10 }}>Order History</h2>
            <input
              type="text"
              placeholder="Search by Order ID..."
              value={orderIdSearch}
              onChange={(e) => setOrderIdSearch(e.target.value)}
              style={{ marginBottom: 10, padding: '8px 12px', fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <input
              type="text"
              placeholder="Search by Date..."
              value={dateSearch}
              onChange={(e) => setDateSearch(e.target.value)}
              style={{ marginBottom: 10, padding: '8px 12px', fontSize: 16, borderRadius: 4, border: '1px solid #ccc' }}
            />
            <button style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }} onClick={handleSearchOrderHistory}>Search</button>
            {(orderIdSearch !== '' || dateSearch !== '') && (
              <button style={{ marginRight: 10, backgroundColor: '#007bff', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }} onClick={handleResetOrderHistorySearch}>Reset</button>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Order ID</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Date</th>
                  <th style={{ border: '1px solid #ccc', padding: 8 }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {orderHistory.map((order, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{order.orderId}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{new Date(order.date).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #ccc', padding: 8 }}>{order.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  
      {/* Button to go to Products page */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <Link to="/product">
          <button
            style={{
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: "4px",
              fontSize: "16px",
            }}
          >
            Go to Products
          </button>
        </Link>
      </div>
    </div>
  );
}  

export default Profile;
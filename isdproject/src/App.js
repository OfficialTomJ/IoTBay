import logo from './logo.svg';
import './App.css';
import {useState, useEffect} from "react";

function App() {
  const [data, setData] = useState("Searching...");

  useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:8080/test', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          "Content-Type": "application/json",
        },
      });
      const responseData = await res.json();
      setData(responseData.message);
    } catch (err) {
      console.log(err);
    }
  };

  fetchData();
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {data}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

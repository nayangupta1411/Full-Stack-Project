import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from "react-router-dom";



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
    <App />
    </Router> 
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// https://github.com/ondiekelijah/Sending-Data-from-React-to-Flask/blob/main/frontend/src/Components/Form.js

//  https://www.loginradius.com/blog/engineering/guest-post/securing-flask-api-with-jwt/#:~:text=To%20do%20this%2C%20you%20need,the%20order%20matters%20a%20lot.&text=You%20need%20to%20add%20a,you%20should%20pass%20to%20JWT.
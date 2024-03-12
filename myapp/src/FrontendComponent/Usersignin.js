import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Input from "@material-ui/core/Input";

export default function Usersignin() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userid = localStorage.getItem('userid');
  const roleBasedAccess = localStorage.getItem('roleBasedAccess');
  // console.log("token",token)
  // console.log("email",userid)x

  const showAlert = (message) => {
    // Use a custom function for displaying alerts
    alert(message);
  };

  const url = "http://127.0.0.1:5000/usersignin"

  const [userSigninData, setUserSigninData] = useState({
    email: "",
    password: ""
  })



  function userSigninSubmit(e) {
    e.preventDefault();

    axios.post(url, userSigninData, {
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'json',
    })
      .then(res => {
        console.log("signin data", res.data)
        if (res.data['status']) {
          alert("email and password are incorrect !!")
          setTimeout(() => {
            window.location.reload();
          }, 10);
        }
        else {
          localStorage.clear();
          localStorage.setItem("token", res.data.access_token);
          localStorage.setItem("userid", res.data.userid);
          localStorage.setItem("roleBasedAccess", res.data.roleBasedAccess);
          showAlert("Successful login !!")
          if (res.data['roleBasedAccess'] == "user") {
            navigate('/items')
          }
          if (res.data['roleBasedAccess'] == "admin") {
            navigate('/adminItems')
          }

        }

      }).catch(function (error) {
        console.log(error);
        alert("email and password are incorrect !!")
        setTimeout(() => {
          window.location.reload();
        }, 10);
      });


  }


  const handleUserSigninData = (e) => {
    const newuser = { ...userSigninData }
    newuser[e.target.id] = e.target.value
    setUserSigninData(newuser)
    console.log("signin data:", newuser);

  }

  function myFunction() {
    var x = document.getElementById("password");
    console.log(x.type);
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }

  }

  return (
    <div><div className="container col-lg-4 col-m-4 col-sm-4 my-5 center bdr p-4">
      <div className="btnn pb-3">
        <h3>Login</h3>
      </div>
      <form onSubmit={userSigninSubmit} >
        <div >
          <div className="form-group" >
            <label >Email Id<sup style={{ color: "#ED7D31" }}>*</sup></label>
            <Input type="email" className="form-control" name="email" id="email" onChange={handleUserSigninData}
              placeholder="Email" aria-label='email' autoComplete='on' required />

          </div>

          <div className="form-group">
            <label>Password<sup style={{ color: "#ED7D31" }}>*</sup></label>
            <Input type="password" name="password" className="form-control" aria-label='password' id="password" placeholder="Password"
              onChange={handleUserSigninData} inputProps={{ minLength: 8 }} autoComplete='on' required />
            <p className="nacc3"><input type="checkbox" className=' mt-2' onClick={myFunction} /> show password </p>

          </div>
        </div>
        <div className="btnn mt-5 mb-3">
          <button type="submit" className="btn btn-dark" >Submit  </button>

        </div>
        <div className="btnn">
          <Link className="nacc" to="/signup">create a new account</Link>


        </div>
      </form>

    </div>
    </div>
  )
}

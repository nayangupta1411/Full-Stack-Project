import React , { useState } from 'react'
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import axios from 'axios';

import Input from "@material-ui/core/Input";

import { Switch } from '@material-ui/core';


function Signup() {

  const navigate = useNavigate();
  const url="http://127.0.0.1:5000/usersignup";

  const reloadPage = () => {
    window.location.reload();
  };


  const [signupData, setSignupData] = useState({
     name :"",
     email:"",
     password:"",
     confirm_password:"",
     roleBasedAccess : ""
  })
  
  
  
  function formSubmit(e) {
    e.preventDefault();
  
    if(signupData['password']===signupData['confirm_password']){
      

     const axiosPromise = axios.post(url,signupData,{
        headers: {
          'Content-Type': 'application/json'},
        responseType: 'json',
      })
      axiosPromise?.then(res=>{
        console.log(res.data)
        if(res.data['status']){
          alert("email is already exists")
          setTimeout(()=>{
            reloadPage();
          }, 10);
        }
        else{
          alert("Signup done !!!")
          navigate("/usersignin");

        }
    
      }).catch(function(error) {
        console.error(error);
      });
   
    }
    else{
      alert("confirm password not matched !!")
    }
   
  }
  
  
  const formData = (e) =>{
    const newdata= { ...signupData }
    newdata[e.target.id]= e.target.value
    setSignupData(newdata)
    // console.log("nre",newdata)
  
  }

  return (
   
    <div data-testid="signup-1">
      <div className="container col-lg-5 col-m-4 col-sm-4 my-5 center bdr p-4">
    <div className="btnn pb-3">
      <h3>Signup</h3>
    </div>
    <form onSubmit={formSubmit}  >
      <div >
      <div className="form-row">
      <div className="form-group col-md-6" >
          <label >Name<sup style={{ color:"#ED7D31" }}>*</sup></label>
          <Input type="text" className="form-control" name="name" id="name"
            placeholder="Name" aria-label='name' onChange={formData} required />
        </div>

        <div className="form-group col-md-6" >
          <label >Email Id<sup style={{ color:"#ED7D31" }}>*</sup></label>
          <Input type="email" className="form-control" name="email" id="email" onChange={formData}
            placeholder="Email" aria-label='email' autoComplete='on' required />
        </div>
        </div>

        
        <div className="form-row">
        <div className="form-group col-md-6">
          <label>Password<sup style={{ color:"#ED7D31" }}>*</sup></label>
          <Input type="password" name="password" className="form-control" aria-label='password' id="password" placeholder="Password" onChange={formData}
            inputProps={{ minLength: 8 }} autoComplete='on' required />
          <p className="nacc2">*password minimum length is 8 characters</p>
        </div>

        <div className="form-group col-md-6">
          <label>Confirm Password<sup style={{ color:"#ED7D31" }}>*</sup></label>
          <div className="password-container" >
          <Input  className="form-control"   name="confirm_password"  aria-label='confirm_password' id="confirm_password" type="password"
          placeholder="Confirm Password" inputProps={{ minLength: 8 }} onChange={formData} 
            required />    
          </div>
          <p className="nacc2">*confirm password should be same</p>
        </div>
          </div>
         
          <div className="form-group row">
    <label htmlFor="inputEmail3"  className="col-sm-4 col-form-label">Access Control<sup style={{ color:"#ED7D31" }}>*</sup></label>
    <div className="col-sm-8 mt-2">
    <div className="form-check form-check-inline mr-4" role="radio" aria-checked="true">
  <input className="form-check-input" type="radio" name="roleBasedAccess" id="roleBasedAccess" onChange={formData} value="admin" required  />
  <label className="form-check-label" htmlFor="roleBasedAccess">Admin</label>
</div>
<div className="form-check form-check-inline" role="radio" aria-checked="false">
  <input className="form-check-input" type="radio" name="roleBasedAccess" id="roleBasedAccess" onChange={formData} value="user" required  />
  <label className="form-check-label" htmlFor="roleBasedAccess">User</label>
</div>
    </div>
  </div>

  

      </div>
      <div className="btnn mt-4 mb-3">
        <button type="submit" name="Submit" className="btn btn-dark"  >Submit  </button>
      
      </div>
      <div className="btnn">
        <Link className="nacc" to="/usersignin">Already have a account</Link>
  
      </div>
      {/* <div className="btnn">
        <Link className="nacc" to="/signin">login with admin account</Link>
  
      </div> */}

      <div>
   
        </div>
    </form>
  
  </div>
  </div>
 
  )
}

export default Signup;
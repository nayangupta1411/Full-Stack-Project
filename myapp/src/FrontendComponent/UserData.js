import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


function UserData() {

    const navigate = useNavigate();
    const token= localStorage.getItem('token');
    const userid=localStorage.getItem('userid');
    const roleBasedAccess= localStorage.getItem('roleBasedAccess');
    const url1="http://127.0.0.1:5000/userValidateTokenController";

    const showAlert = (message) => {
        window.alert(message);
      };

    useEffect(()=>{
        fetchToken(); })
    async function fetchToken(){
       await axios.get(url1,{
            headers: {
                'Content-Type': 'application/json'   
            },
            responseType: 'json',
          })
          .then(data =>
            {
              console.log("token is here ",data)
              if (data["data"]["userid"]){
                if(data["data"]["token"]!=token || data["data"]["userid"]!=userid  || roleBasedAccess!="admin"){
                    showAlert('Bad Request !!');
                    localStorage.clear();
                    navigate('/usersignin')
                  }
              }
              
            })
        .catch(function(error) {
            console.error(error);
            if (error){
                localStorage.clear();
                navigate('/usersignin')
              }
          });
    }

    const [userData, setuserData] = useState([]);
    useEffect(() => { getuserData(); }, [])

    function getuserData() {
        axios.get('http://127.0.0.1:5000/getUserData')
            .then(function (res) {
                // console.log("data aa gaya",res.data);
                setuserData(res.data);
            }).catch(function (error) {
                console.log(error);
                alert("Bad Request !!")
                localStorage.clear();
                navigate('/usersignin')
            });
    }
    return (
        <div>
            <div class="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                <div class="input-group">
                </div>
                <div class="btn-group" role="group" aria-label="First group">
                    <button type="button" class="btn btn-secondary" onClick={() => { localStorage.clear(); navigate('/usersignin')}} >logout</button>
                </div>

            </div>
            {token == undefined || token == '' ? "Token is expire so firstly login in" : (

                <div className="container-fluid center ">

                    <div className="container-fluid  col-lg-10 bdr mt-5" >
                        <div className="form-group center btnn pb-3 pt-3" >
                            <h3>User's Data</h3>
                        </div>
                        <div className=" center">
                            <table style={{ width: " 100%", height: "300%" }}>
                                <thead>
                                    <tr className=" bdrr">
                                        <th className="thead" > Sr. No. </th>
                                        <th className="thead" > Name </th>
                                        <th className="thead">Email Id</th>
                                        <th className="thead">Password </th>
                                        <th className="thead">Role </th>

                                       
                                    </tr></thead>
                                <tbody className='p-2'>
                                    {userData.map((user, key) =>
                                        <tr className="container p-2 " key={key}>
                                            <td>{key + 1} </td>
                                            <td>{user.name} </td>
                                            <td > {user.email} </td>
                                            <td className='word' >{user.password}  </td>
                                            <td > {user.roleBasedAccess} </td>
                                        
                                        </tr>
                                    )
                                    }
                                </tbody>
                            </table>


                        </div>

                    </div>
                </div>
             )} 
        </div>
    )
}

export default UserData;

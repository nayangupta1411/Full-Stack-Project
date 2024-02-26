import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Input from "@material-ui/core/Input";
import { Trash } from 'react-bootstrap-icons';
import { Switch } from '@material-ui/core';

function AddNewItems() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');
    const roleBasedAccess= localStorage.getItem('roleBasedAccess');
    const url1 = "http://127.0.0.1:5000/userValidateTokenController"
    console.log("userid",userid)
    console.log("token",token)

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
                    alert("Bad Request !!")
                    localStorage.clear();
                    navigate('/usersignin')
                }
              }
            //   console.log("userid ",data["data"]["userid"])
            })
        .catch(function(error) {
            console.log(error);
            if (error){
                localStorage.clear();
                navigate('/usersignin')
              }
          });
    }


    const [selectItems, setselectItems] = useState([]);
    useEffect(() => { getselectItems(); }, [])

    const [checked, setChecked]=useState(true)
    

    function getselectItems() {
        const axiosPromise =axios.get('http://127.0.0.1:5000/selectAllItemsAdmin')
        axiosPromise?.then(function (res) {
                // console.log("data aa gaya",res.data);
                setselectItems(res.data);
            }).catch(function (error) {
                console.log(error);
                alert("Bad Request !!")
                localStorage.clear();
                navigate('/usersignin')
            });
    }


    const url = "http://127.0.0.1:5000/addNewItems"
    const [newItemData, setNewItemData] = useState({
        cuisine: "",
        active: "1"
        // userid: userid

    })

    function handleSubmit1(e) {
        e.preventDefault();

        const axiosPromise = axios.post(url, newItemData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token} `
            },
            responseType: 'json',

        })
        axiosPromise?.then(res => {
                console.log(res.data)

            }).catch(function (error) {
                console.log(error);
                alert("Bad Request !!")
                localStorage.clear();
                navigate('/usersignin')
            });


        alert('Order Completed !!');
        setTimeout(() => {
            window.location.reload();
        }, 10);

    }

    const handlenewItemData = (e) => {
        const newdata = { ...newItemData }
        newdata[e.target.id] = e.target.value
        setNewItemData(newdata)
        console.log("nre", newdata)

    }



    const setStatus= (_id) => {
        console.log(_id)
        axios.post("http://127.0.0.1:5000/deleteNewItems",_id,{
           headers: {'Content-Type': 'application/json',
           Authorization:`Bearer ${token}`},
           responseType: 'json',
         })
         .then(res=>{
           console.log('data',res.data)
         }).catch(function (error) {
            console.log(error);
            alert("Bad Request !!")
            localStorage.clear();
            navigate('/usersignin')
        });

         alert('Menu updated !!');
         setTimeout(() => {
            window.location.reload();
        }, 10);
         
}

    return (
        <div>
             <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                <div className="input-group">
                </div>
                <div className="btn-group" role="group" aria-label="First group">
                    <button type="button" className="btn btn-secondary" onClick={() => { localStorage.clear(); navigate('/usersignin')}} >logout</button>
                </div>

            </div>
            {token == undefined || token == '' ? "Token is expire so firstly login in" : (

                <div className="container-fluid center row">
                    <div className="container col-lg-4 bdr center mt-5" >
                        <form onSubmit={handleSubmit1} >
                            <div >
                                <div className="form-group center btnn pb-3 pt-3" >
                                    <h3>Add New Item</h3>
                                </div>
                           
                                <div >
                                    <label >Cuisine</label>
                                    <Input type="text" data-testid='cuisine-input' className="form-control" onChange={handlenewItemData} id="cuisine" name="cuisine" placeholder="cuisine" required />
                                </div>
                               
                                <div className="btnn mt-3 mb-4">
                                    <button type="submit" className="btn btn-dark" >Submit</button>

                                </div>
                            </div>
                        </form>

                    </div>
                    <div className="container-fluid  col-lg-7 bdr mt-5" >
                        <div className="form-group center btnn pb-3 pt-3" >
                            <h3>Item List</h3>
                        </div>
                        <div className=" center">
                            <table style={{ width: " 100%", height: "300%" }}>
                                <thead>
                                    <tr className=" bdrr">
                                    <th className="thead" > Sr. No. </th>
                                        <th className="thead" > Cuisines </th>

                                        {/* <th className="thead">Update</th> */}
                                        <th className="thead">Status <small> (Active/Inactive)</small></th>
                                    </tr></thead>
                                <tbody className='p-2'>
                                    {selectItems.map((user, key) =>
                                        <tr className="container p-2 " key={key}>
                                            <td>{ key+1 }</td>
                                            <td>{user.cuisine} </td>
                                            <td ><Switch checked={user.active=="1" ? checked : !checked}  name="checked" color="secondary"  onClick={()=> setStatus(user._id )}/>
                                                </td>

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

export default AddNewItems;
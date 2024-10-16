import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PencilSquare } from 'react-bootstrap-icons';
import { Trash } from 'react-bootstrap-icons';

function AdminItemsPage() {

    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const userid = localStorage.getItem('userid');
    const roleBasedAccess = localStorage.getItem('roleBasedAccess');
    const url1 = "http://127.0.0.1:5000/userValidateTokenController"
    // console.log("userid",userid)
    // console.log("token",token)


    //  checking Token  is valid or not

    useEffect(() => {
        fetchToken();
    })
    function fetchToken() {
        const axiosPromise = axios.get(url1, {
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'json',
        })
        axiosPromise?.then(data => {
            console.log("token is here ", data)
            if (data["data"]["userid"]) {
                if (data["data"]["token"] != token || data["data"]["userid"] != userid || roleBasedAccess != "admin") {
                    alert("Bad Request !!")
                    localStorage.clear();
                    navigate('/usersignin')
                }
            }

            //   console.log("userid ",data["data"]["userid"])
        })
            .catch(function (error) {
                console.log(error);
                if (error) {
                    localStorage.clear();
                    navigate('/usersignin')
                }
            });
    }


    //  fetching all data into order lists from databse 

    const [fdata, setFdata] = useState([]);
    useEffect(() => { getFdata(); }, [])

    function getFdata() {
        const axiosPromise = axios.get('http://127.0.0.1:5000/itemall', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            responseType: 'json',
        })
        axiosPromise?.then(function (res) {
            // console.log("data aa gaya",res.data);
            setFdata(res.data);
        }).catch(function (error) {
            console.log(error);
            alert("Bad Request !!")
            localStorage.clear();
            navigate('/usersignin')
        });
    }

    //   fetching all options into selection area  from databse 

    const [Sdata, setSdata] = useState([]);
    useEffect(() => { getSdata(); }, [])

    function getSdata() {
        const axiosPromise = axios.get('http://127.0.0.1:5000/selectAllItems', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            responseType: 'json',
        })
        axiosPromise?.then(function (res) {
            // console.log("data aa gaya",res.data);
            setSdata(res.data);
        }).catch(function (error) {
            console.log(error);
            alert("Bad Request !!")
            localStorage.clear();
            navigate('/usersignin')
        });
    }


    //  adding a new order 
    const url = "http://127.0.0.1:5000/items"
    const [data1, setInputs1] = useState({
        cuisine: "",
        quantity: "",
        instructions: "",
        userid: userid


    })

    function handleSubmit1(e) {
        e.preventDefault();

        const axiosPromise = axios.post(url, data1, {
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

    const handleData1 = (e) => {
        const newdata = { ...data1 }
        newdata[e.target.id] = e.target.value
        setInputs1(newdata)
        console.log("nre", newdata)

    }


    //  delete a order

    const setDelete = (_id) => {
        console.log(_id)
        axios.post("http://127.0.0.1:5000/itemdel", _id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            responseType: 'json',
        })
            .then(res => {
                console.log('yaha bhi data hai', res.data)
            }).catch(function (error) {
                console.log(error);
                alert("Bad Request !!")
                localStorage.clear();
                navigate('/usersignin')
            });

        alert('Order Deleted !!');
        setTimeout(() => {
            window.location.reload();
        }, 10);
    }

    //  update a order
    const setUpdate = (_id) => {
        console.log("id:", _id);

        axios.post("http://127.0.0.1:5000/itemUpdate", _id, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            responseType: 'json',
        })
            .then(res => {
                console.log('yaha bhi data hai', res.data)
            }).catch(function (error) {
                console.log(error);
                alert("Bad Request !!")
                localStorage.clear();
                navigate('/usersignin')
            });
        navigate('/UpdateItem');

    }

    return (
        <>
            <div>

                <div className="btn-toolbar justify-content-between" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="input-group">
                    </div>
                    <div className="btn-group" role="group" aria-label="First group">

                        <button type="button" className="btn btn-primary" onClick={() => navigate('/addNewItems')}>Add Items</button>
                        <button type="button" className="btn btn-info" onClick={() => navigate('/userData')}>User Details</button>
                        <button type="button" className="btn btn-secondary" onClick={() => { localStorage.clear(); navigate('/usersignin') }} >logout</button>
                    </div>

                </div>
                {token == undefined || token == '' ? "Token is expire so firstly login in" : (
                    <div className="container-fluid center row">
                        <div className="container col-lg-4 bdr center mt-5" >
                            <form onSubmit={handleSubmit1} >
                                <div >
                                    <div className="form-group center btnn pb-3 pt-3" >
                                        <h3>Order</h3>
                                    </div>
                                    <div className="form-group">
                                        <label >Cuisine<sup style={{ color: "#ED7D31" }}>*</sup></label>
                                        <select className="form-control"  data-testid='cuisine-input' id="cuisine" name="cuisine" onChange={handleData1} required >
                                            <option value="Pizza" style={{ display: 'none' }}>Select</option>
                                            {Sdata.map((user, key) =>
                                                <option>{user.cuisine}  </option>

                                            )}
                                        </select>
                                    </div>
                                    <div >
                                        <label >Quantity<sup style={{ color: "#ED7D31" }}>*</sup></label>
                                        <input type="number" className="form-control" data-testid="quantity-input" onChange={handleData1} id="quantity" name="quantity" placeholder="i.e 3,4,5" required />
                                    </div>
                                    <div className="form-group">
                                        <label >Instruction <small>(optional)</small></label>
                                        <textarea className="form-control" onChange={handleData1} data-testid="instructions-input" id="instructions" name="instructions" placeholder='comments...' rows="3" ></textarea>
                                    </div>
                                    <div className="btnn mt-3 mb-4">
                                        <button type="submit" name="Submit" className="btn btn-dark" >Submit</button>

                                    </div>
                                </div>
                            </form>

                        </div>
                        <div className="container-fluid  col-lg-7 bdr mt-5" >
                            <div className="form-group center btnn pb-3 pt-3" >
                                <h3>Order List</h3>
                            </div>
                            <div className=" center">
                                <table style={{ width: " 100%", height: "300%" }}>
                                    <thead>
                                        <tr className=" bdrr">
                                            <th className="thead" > Sr. No. </th>
                                            <th className="thead" > Email Id </th>
                                            <th className="thead" > Cuisine </th>
                                            <th className="thead">Quantity</th>
                                            <th className="thead">Instruction </th>
                                            <th className="thead">Update</th>
                                            <th className="thead">Delete</th>
                                        </tr></thead>
                                    <tbody className='p-2'>
                                        {fdata.map((user, key) =>
                                            <tr className="container p-2 " key={key}>
                                                <td>{key + 1} </td>
                                                <td>{user.userid} </td>
                                                <td>{user.cuisine} </td>
                                                <td > {user.quantity} </td>
                                                <td >{user.instructions}  </td>
                                                <td ><button type="submit" className="btn btn-outline-success m-1" onClick={() => setUpdate(user._id)} ><div><PencilSquare /></div></button></td>
                                                <td ><button type="submit" className="btn btn-outline-danger" onClick={() => setDelete(user._id)} ><div><Trash /></div></button></td>

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
        </>
    )
}

export default AdminItemsPage;

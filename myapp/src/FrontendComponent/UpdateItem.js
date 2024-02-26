import React, {useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function UpdateItem() {

    const navigate = useNavigate();
    const token= localStorage.getItem('token');
    const userid=localStorage.getItem('userid');
    const url1="http://127.0.0.1:5000/userValidateTokenController";
    
    


    useEffect(()=>{
        fetchToken(); })
   function fetchToken(){
        const axiosPromise = axios.get(url1,{
        headers: {'Content-Type': 'application/json',
        'Authorization':`Bearer ${token}`},
            responseType: 'json',
          })
          axiosPromise?.then(data =>
            {
              console.log("token is here ",data)
              if (data["data"]["userid"]){
                if(data["data"]["userid"]!=userid){
                    alert("Bad Request !!")
                    localStorage.clear();
                    navigate('/usersignin')
                }}
            })
        .catch(function(error) {
            console.log(error);
            if (error){
                localStorage.clear();
                navigate('/usersignin')
              }
          });
    }

    const [fdata1, setFdata1] = useState([]);
    useEffect(() => {
        getFdata1();
    }, [])

    function getFdata1() {
        const axiosPromise =  axios.get('http://127.0.0.1:5000/itemSetUpdate',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`   
            },
            responseType: 'json',
          })
          axiosPromise?.then(function(res) {
            console.log("data aa gaya id no",res.data);
            setFdata1( res.data);
        }).catch(function (error) {
            console.log(error);
            alert("Bad Request !!")
            localStorage.clear();
            navigate('/usersignin')
        });
    }
    
    console.log("fdata1 ---> ",fdata1)

    const [Sdata, setSdata] = useState([]);
    useEffect(() => { getSdata(); }, [])

    function getSdata() {
        const axiosPromise = axios.get('http://127.0.0.1:5000/selectAllItems')
        axiosPromise?.then(function(res) {
            // console.log("data aa gaya",res.data);
            setSdata( res.data);
        }).catch(function (error) {
            console.log(error);
            alert("Bad Request !!")
            localStorage.clear();
            navigate('/usersignin')
        });
    }
    

    console.log("shhshs --",fdata1)
    // const cuisi = fdata1.map((user) =>{ return user.cuisine})
    // const quant = fdata1.map((user) =>{ return user.quantity}) 
    // const instruct = fdata1.map((user) =>{ return user.instructions})

    const cuisi = fdata1.length > 0 ? fdata1.map((user) => user.cuisine) : [];
const quant = fdata1.length > 0 ? fdata1.map((user) => user.quantity) : [];
const instruct = fdata1.length > 0 ? fdata1.map((user) => user.instructions) : [];

     
    console.log("cuisi:",cuisi)
    // console.log("quant:",quant)
    // console.log("instruct:",instruct)

    const url = "http://127.0.0.1:5000/itemUpdateOne"
    
    const [data2, setInputs2] = useState({ 
        cuisine:'',
        quantity:'',
        instructions:''
     })
  
    

    const handleData2 = (e) => {
        const newdata = { ...data2 }
    
            newdata[e.target.id] = e.target.value
        
        
        if (newdata['cuisine']==''){
            newdata['cuisine']=cuisi[0]
        }
        if (newdata['quantity']==''){
            newdata['quantity']=quant[0]
        }
        if (newdata['instructions']==''){
            newdata['instructions']=instruct[0]
        }
       
        setInputs2(newdata)

    }

    function handleSubmit2(e) {
        e.preventDefault();
        axios.post(url, data2,  {
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${token}`   
            },
            responseType: 'json',
          })
            .then(res => {
                console.log("data: ",res.data)
               
               
            }).catch(function (error) {
                console.log(error);
                alert("Bad Request !!")
                localStorage.clear();
                navigate('/usersignin')
            });
            alert('Order Update !!');
            if (userid==="nayan448@gmail.com"){
                navigate('/adminItems');
            }
            else{
                navigate('/Items');
            }
  
    }

   
  return (

    <div>
        {token==undefined || token=='' ? "Token is expire so firstly login in":( 
    <div className="container-fluid center row">
    <div className="container col-lg-4 bdr center mt-5" >
    { fdata1.map((user,key) => { return (
        <form onSubmit={handleSubmit2}  >
        
            <div >
                <div className="form-group center btnn pb-3 pt-3" >
                    <h3>Order</h3>
                </div>
                <div key={key}>
                <div className="form-group" >
                    <label>Cuisine</label>
                    <select className="form-control" data-testid='cuisine-input'  id="cuisine" defaultValue={ user.cuisine } name="cuisine" onChange={handleData2} required >
                        <option>Select</option>
                         { Sdata.map((user,key) =>  
                            <option>{ user.cuisine }  </option> 
                               
                          )} 
                    </select>
                </div>
                <div className="form-group"  >
                    <label >Quantity</label>
                    <input type="number"  className="form-control"  data-testid="quantity-input" defaultValue={ user.quantity }  onChange={handleData2} id="quantity" name="quantity" placeholder="i.e 3,4,5" required />
                </div>
                <div className="form-group"  >
                    <label >Instruction<small>(optional)</small></label>
                    <textarea className="form-control"  onChange={handleData2} data-testid="instructions-input" defaultValue={ user.instructions } id="instructions" name="instructions" rows="3" ></textarea>
                </div>
                </div>
                <div className="btnn mt-3 mb-4">
                    <button type="submit" name="Submit" className="btn btn-dark" >Submit</button>

                </div>
            </div>
       
        </form>
       ); } )} 
        </div>
        </div>
    )}
     </div>
  )
}


export default UpdateItem;
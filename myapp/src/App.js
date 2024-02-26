import logo from './logo.svg';
import './App.css';
import { 
  BrowserRouter as Router,  
  Routes, 
  Route, 
 
} from "react-router-dom"; 
import Header from './FrontendComponent/Header.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "bootstrap-icons/font/bootstrap-icons.css"
import "bootstrap4-toggle/css/bootstrap4-toggle.min.css";
import "jquery/dist/jquery.min.js";
import Items from './FrontendComponent/Items';
import UpdateItem from './FrontendComponent/UpdateItem';
import Signup from './FrontendComponent/Signup';
import Usersignin from './FrontendComponent/Usersignin';
import AdminItemsPage from './FrontendComponent/AdminItemsPage';
import AddNewItems from './FrontendComponent/AddNewItems';
import UserData from './FrontendComponent/UserData';

function App() {
   
  return (
    <>
      <Header  title="FoodPanda"/>
      
      <Routes> 
          <Route exact path="/" element={<Signup/>} /> 
          {/* <Route exact path="/signin" element={<Signin/>} />  */}
          <Route exact path="/signup" element={<Signup/>} /> 
          <Route exact path="/usersignin" element={<Usersignin/>} /> 
          <Route exact path="/items" element={<Items />} /> 
          <Route exact path="/UpdateItem" element={<UpdateItem />} /> 
          <Route exact path="/adminItems" element={<AdminItemsPage />} /> 
          <Route exact path="/addNewItems" element={<AddNewItems/>} /> 
          <Route exact path="/userData" element={<UserData/>} /> 
          {/* <Navigate to="/" />  */}
        </Routes>
   </>
  );
}

export default App;


// response1={
//   "access_token": access_token,
//   "Status": 200,
//   "userid":email
//   }


// import { render, screen } from '@testing-library/react';
// import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
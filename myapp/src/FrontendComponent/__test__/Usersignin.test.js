import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios'; // You may need to mock axios calls
import {BrowserRouter as Router} from 'react-router-dom';
import { MemoryRouter } from 'react-router-dom';
import Usersignin from '../Usersignin';

import MockAdapter from 'axios-mock-adapter';


// Mocking axios post method
jest.mock('axios');

global.alert = jest.fn();

describe('Usersignin Component', () => {
  it('should render the component', () => {
    const { getByText, getByPlaceholderText } = render(<Router><Usersignin /></Router>);
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByPlaceholderText('Email')).toBeInTheDocument();
    expect(getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should handle form submission and perform login', async () => {
    // Mock axios post method to simulate successful login
    axios.post.mockResolvedValue({
      data: {
        status: false,
        access_token: 'fake-token',
        userid: '123',
        roleBasedAccess: 'user',
      },
    });

    const { getByPlaceholderText, getByText } = render(<Router><Usersignin /></Router>);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Trigger form submission
    fireEvent.click(submitButton);

    // Wait for the axios post request to be resolved
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Assertions for successful login
    expect(localStorage.getItem('token')).toBe('fake-token');
    expect(localStorage.getItem('userid')).toBe('123');
    expect(localStorage.getItem('roleBasedAccess')).toBe('user');
    // You may need to add more assertions based on your component's behavior
  });

  it('should handle form submission and perform login (admin)', async() => {

    axios.post.mockResolvedValue({
        data: {
          status: false,
          access_token: 'fake-token',
          userid: '123',
          roleBasedAccess: 'admin',
        },
      });
  
      const { getByPlaceholderText, getByText } = render(<Router><Usersignin /></Router>);
      const emailInput = getByPlaceholderText('Email');
      const passwordInput = getByPlaceholderText('Password');
      const submitButton = getByText('Submit');
  
      // Simulate user input
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
  
      // Trigger form submission
      fireEvent.click(submitButton);
  
      // Wait for the axios post request to be resolved
      await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  
      // Assertions for successful login
      expect(localStorage.getItem('token')).toBe('fake-token');
      expect(localStorage.getItem('userid')).toBe('123');
      expect(localStorage.getItem('roleBasedAccess')).toBe('admin');
  
  })

 it ('if the status is true ',async () => {

    axios.post.mockResolvedValue ({
        data: {
            status: true,
            access_token: 'fake-token',
            userid: '123',
            roleBasedAccess: 'user',
          },
    });
    
    const { getByPlaceholderText, getByText } = render(<Router><Usersignin /></Router>);
    const emailInput = getByPlaceholderText('Email');
    const passwordInput = getByPlaceholderText('Password');
    const submitButton = getByText('Submit');

    // Simulate user input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Trigger form submission
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  
    // Assertions for successful login
    // expect(localStorage.getItem('token')).toBe('');
    // expect(localStorage.getItem('userid')).toBe('');
    // expect(localStorage.getItem('roleBasedAccess')).toBe('');
    expect(global.alert).toHaveBeenCalledWith('email and password are incorrect !!');
    

 });

 test('new case', async() => {

  // const axiosMock = new MockAdapter(axios);
  // axiosMock.onPost('/usersignin').reply(401, { error: 'Token has expire' });

  axios.post.mockResolvedValue ({
    data: {
        status: true,
       
      },
});

  const { getByPlaceholderText, getByText } = render(<Router><Usersignin /></Router>);
  const emailInput = getByPlaceholderText('Email');
  const passwordInput = getByPlaceholderText('Password');
  const submitButton = getByText('Submit');

  // Simulate user input
  fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
  fireEvent.change(passwordInput, { target: { value: 'passwor3' } });

  // Trigger form submission
  fireEvent.click(submitButton);
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(global.alert).toHaveBeenCalledWith('email and password are incorrect !!');
  });
 })


//  it('snew case', async() => {

//     // axios.post.mockResolvedValue({
//     //     data: {
//     //       status: false,
//     //       access_token: 'fake-token',
//     //       userid: '123',
//     //       roleBasedAccess: 'admin',
//     //     },
//     //   });
  
//       const { getByPlaceholderText, getByText } = render(<MemoryRouter><Usersignin /></MemoryRouter>);
//       const emailInput = getByPlaceholderText('Email');
//       const passwordInput = getByPlaceholderText('Password');
//       const submitButton = getByText('Submit');
  
//       // Simulate user input
//       fireEvent.change(emailInput, { target: { value: 'test@gmail.com' } });
//       fireEvent.change(passwordInput, { target: { value: 'passw' } });
  
//       // Trigger form submission
//       fireEvent.click(submitButton);
  
//       // Wait for the axios post request to be resolved
//     //   await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  
//       // Assertions for successful login
    
//       expect(global.alert).toHaveBeenCalledWith('email and password are incorrect !!');
  
//   })

});

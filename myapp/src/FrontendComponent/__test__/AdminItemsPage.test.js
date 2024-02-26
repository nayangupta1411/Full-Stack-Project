import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';
import AdminItemsPage from '../AdminItemsPage';
import {BrowserRouter} from 'react-router-dom';

jest.mock('axios');
console.log = jest.fn();
global.alert= jest.fn();

describe('AdminItemsPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the component with a valid token', async () => {
    localStorage.setItem('token', 'validToken');
    localStorage.setItem('userid', 'userId');
    localStorage.setItem('roleBasedAccess', 'admin');

    axios.get.mockResolvedValueOnce({
      data: {
        userid: 'userId',
        token: 'validToken',
      },
    });

    axios.get.mockResolvedValueOnce({
      data: [
        {
      cuisine: "pizza",
      quantity: "2",
      instructions: "extra cheez",
      userid: '123'
        }
      ],
    });

    axios.get.mockResolvedValueOnce({
      data: [
        {
        cuisine: "pizza",}
      ],
    });

    render(
      <BrowserRouter>
        <AdminItemsPage />
      </BrowserRouter>
    );

    // Add your assertions based on the rendered component
    // For example:
    expect(screen.getByText('Order List')).toBeInTheDocument();
    expect(screen.getByText('Add Items')).toBeInTheDocument();
    // ...

    // You can also check if certain asynchronous operations have been called
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(3);
      expect(axios.post).toHaveBeenCalledTimes(0);
    });
  });

  

  it('handles form submission correctly', async () => {

    axios.get.mockResolvedValue({ data: { userid: '123', token: 'fakeToken' } });

    const token = 'fakeToken';
    const userid = '123';
   

    const mockLocalStorage = {
      getItem: jest.fn((key) => {
        if (key === 'token') {
          return 'fakeToken';
        }
        // Handle other keys as needed
      }),
      clear: jest.fn(),
    };
    global.localStorage = mockLocalStorage;

    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('userid', '123');

    // Render the component with a valid token
    const { getByText }=render(
      <BrowserRouter>
        <AdminItemsPage/>
      </BrowserRouter>
    );
    

  await waitFor(() => {
    
    fireEvent.change(screen.getByTestId('cuisine-input'), { target: { key : 'Select' } });
    console.log(" container select data -->", screen.getByTestId('cuisine-input') )
    fireEvent.change(screen.getByPlaceholderText('i.e 3,4,5'), { target: { value: '2' } });
    fireEvent.change(screen.getByPlaceholderText('comments...'), { target: { value: 'Extra cheese' } });
    })
    
    
    // Simulate form submission
    fireEvent.click(getByText('Submit'));
    // fireEvent.submit(getByTestId('your-form'));

    // Wait for the Axios request to be handled
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // Verify that the correct URL, data, and headers are used in the Axios request
    expect(axios.post).toHaveBeenCalledWith(
      'http://127.0.0.1:5000/items',
      {
        cuisine: 'Pizza',
        quantity: '2',
        instructions: 'Extra cheese',
        userid: '123',
      },
      { headers:
         { 
          Authorization: 'Bearer fakeToken ', 
          'Content-Type': 'application/json' 
        }, 
          responseType: 'json' 
        }
      
    );

    // Mock the Axios response
    axios.post.mockResolvedValue({ data: 'mocked response' });
 
    // Wait for the component to handle the Axios response
    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith("nre", {"cuisine": "Pizza", "instructions": "", "quantity": "", "userid": "123"});
      expect(global.alert).toHaveBeenCalledWith('Order Completed !!');
    });

    // Ensure that the navigate function is called
    await waitFor(() => {
      expect(global.window.location.pathname).toEqual('/usersignin');
    });
    ;

    // Ensure that localStorage.clear() is called
    expect(localStorage.clear()).toBe();

  
  });


  it('handles data input correctly',async () => {

    // const token = 'mockedToken';
    // const userid = 'mockedUserId';
    // // const navigate = jest.fn();

    localStorage.setItem('token', 'fakeToken');
    localStorage.setItem('userid', '123');

    render(<BrowserRouter>
      <AdminItemsPage   />
      </BrowserRouter>
    );

   
    await waitFor(() => {
    
      fireEvent.change(screen.getByTestId('cuisine-input'), { target: { key : 'Select' } });
      console.log(" container select data -->", screen.getByTestId('cuisine-input') )
      fireEvent.change(screen.getByPlaceholderText('i.e 3,4,5'), { target: { value: 2 } });
      fireEvent.change(screen.getByPlaceholderText('comments...'), { target: { value: 'Extra cheese' } });
      })


      expect(screen.getByTestId('cuisine-input')).toHaveValue('Pizza');
      expect(screen.getByTestId('quantity-input')).toHaveValue(2);
      expect(screen.getByTestId('instructions-input')).toHaveValue('Extra cheese');
    // You can check the state or other aspects of the component after handling data input
    // For example, you can expect the state to be updated accordingly
    // expect(screen.getByTestId('your-form')).toContain('Updated State: {"cuisine":"Pizza","quantity":"2","instructions":"Extra cheese"}');
  });


  it('localStorage clear', async() => {

    localStorage.setItem('token', '');
    localStorage.setItem('userid', '123');

    render(<BrowserRouter>
      <AdminItemsPage  />
      </BrowserRouter>
    );
    await waitFor(() => {
      expect(screen.getByText('Token is expire so firstly login in')).toBeInTheDocument();
    });

  })
});
